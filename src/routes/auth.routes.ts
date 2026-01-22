import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { deleteFromR2 } from "../services/storage"; 
import { verificarToken, AuthRequest } from "../middlewares/auth";
import { enviarEmailRecuperacao } from "../services/emailService";
import { createAuditLog } from "../services/audit.service"; // ✅ NOVA IMPORTAÇÃO
import rateLimit from "express-rate-limit";

// --- IMPORTAÇÕES DO ZOD ---
import { validate } from "../middlewares/validateResource";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/authSchemas";

const router = Router();

// --- CONFIGURAÇÕES ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: "Muitas tentativas de login. Conta bloqueada temporariamente por 15 minutos.",
});

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_super_secreta_recuperacao";

// --- HELPER: Verificar Admin (Reutilizável) ---
const checkAdmin = async (userId: number) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { tipo_usuario: true },
  });
  return user?.tipo_usuario === "admin";
};

// ======================================================
// 1. REGISTRO
// ======================================================
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response) => {
    const { nome, email, senha, cpf, telefone } = req.body;

    try {
      const usuarioExistente = await prisma.users.findFirst({
        where: {
          OR: [{ email: email }, { cpf: cpf }],
        },
      });

      if (usuarioExistente) {
        if (usuarioExistente.email === email) {
          return res.status(400).json({ msg: "Este e-mail já está em uso." });
        }
        if (usuarioExistente.cpf === cpf) {
          return res.status(400).json({ msg: "Este CPF já está cadastrado." });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const novoUsuario = await prisma.users.create({
        data: {
          nome,
          email,
          senha_hash: senhaHash,
          cpf,
          telefone,
          tipo_usuario: "cliente",
        },
        select: { id: true, nome: true, email: true },
      });

      // ✅ AUDITORIA: Registro de novo usuário
      await createAuditLog(novoUsuario.id, "REGISTRO", "Usuário realizou o autocadastro no sistema");

      return res.json({ msg: "Usuário criado com sucesso!", user: novoUsuario });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Erro ao cadastrar" });
    }
  },
);

// ======================================================
// 2. LOGIN
// ======================================================
router.post(
  "/login",
  validate(loginSchema),
  loginLimiter,
  async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
      const user = await prisma.users.findUnique({
        where: { email: email },
      });

      if (!user || !(await bcrypt.compare(senha, user.senha_hash))) {
        return res.status(400).json({ msg: "E-mail ou senha incorretos." });
      }

      const secret = process.env.JWT_SECRET || "segredo_padrao_teste";
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

      // ✅ AUDITORIA: Login realizado
      await createAuditLog(user.id, "LOGIN", "Usuário realizou login com sucesso");

      return res.json({
        msg: "Logado com sucesso!",
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo_usuario: user.tipo_usuario,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Erro no servidor" });
    }
  },
);

// ======================================================
// 3. LISTAR CLIENTES (Admin)
// ======================================================
router.get("/clientes", verificarToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId || !(await checkAdmin(req.userId))) {
      return res.status(403).json({ msg: "Acesso negado" });
    }

    const clientes = await prisma.users.findMany({
      where: { tipo_usuario: "cliente" },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, email: true, cpf: true, telefone: true },
    });

    return res.json(clientes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao listar clientes" });
  }
});

// ======================================================
// 4. DELETAR USUÁRIO (R2 + AUDITORIA) ✅
// ======================================================
router.delete("/users/:id", verificarToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const solicitanteId = req.userId;

  try {
    if (!solicitanteId || !(await checkAdmin(solicitanteId))) {
      return res.status(403).json({ msg: "Acesso negado." });
    }

    if (id === String(solicitanteId)) {
      return res.status(400).json({ msg: "Você não pode deletar sua própria conta." });
    }

    // 1. Busca arquivos para apagar do R2
    const arquivosDoCliente = await prisma.documents.findMany({
      where: { user_id: Number(id) }, 
      select: { url_arquivo: true },
    });

    // 2. Apaga arquivos do R2
    if (arquivosDoCliente.length > 0) {
      await Promise.all(
        arquivosDoCliente
          .filter(doc => doc.url_arquivo)
          .map(doc => deleteFromR2(doc.url_arquivo!))
      );
    }

    // 3. Limpeza de banco
    await prisma.notifications.deleteMany({ where: { user_id: Number(id) } });
    await prisma.documents.deleteMany({ where: { user_id: Number(id) } });
    await prisma.auditLog.deleteMany({ where: { user_id: Number(id) } }); // Opcional: Manter ou apagar histórico

    // 4. Apaga o usuário
    const usuarioDeletado = await prisma.users.delete({
      where: { id: Number(id) },
      select: { nome: true },
    });

    // ✅ AUDITORIA: Registro da deleção feita pelo Admin
    await createAuditLog(
      solicitanteId, 
      "DELETOU_USUARIO", 
      `Admin deletou o usuário ${usuarioDeletado.nome} (ID: ${id}) e limpou todos os arquivos.`
    );

    return res.json({ msg: "Usuário e arquivos removidos com sucesso." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao deletar usuário." });
  }
});

// ======================================================
// 5. ATUALIZAR USUÁRIO
// ======================================================
router.put("/users/:id", verificarToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { nome, email, cpf, telefone } = req.body;

  try {
    if (!req.userId || !(await checkAdmin(req.userId))) {
      return res.status(403).json({ msg: "Acesso negado." });
    }

    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: { nome, email, cpf, telefone },
    });

    // ✅ AUDITORIA: Atualização de dados
    await createAuditLog(
      req.userId, 
      "ATUALIZOU_USUARIO", 
      `Admin atualizou dados do usuário ID ${id}`
    );

    return res.json({ msg: "Dados atualizados!", user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao atualizar usuário." });
  }
});

// ======================================================
// 6. ESQUECI A SENHA
// ======================================================
router.post("/forgot-password", validate(forgotPasswordSchema), async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ msg: "E-mail não encontrado." });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    const link = `https://leandro-abreu-contabilidade.vercel.app/redefinir-senha?token=${token}`;
    
    await enviarEmailRecuperacao(email, link);

    // ✅ AUDITORIA: Solicitação de recuperação
    await createAuditLog(user.id, "SOLICITOU_RECUPERACAO", "Usuário solicitou link de redefinição de senha");

    return res.json({ msg: "Link de recuperação enviado!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erro interno." });
  }
});

// ======================================================
// 7. RESETAR SENHA
// ======================================================
router.post("/reset-password", validate(resetPasswordSchema), async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const user = await prisma.users.update({
      where: { email: decoded.email },
      data: { senha_hash: hash },
    });

    // ✅ AUDITORIA: Senha alterada
    await createAuditLog(user.id, "REDEFINIU_SENHA", "Usuário alterou a senha via link de recuperação");

    return res.json({ msg: "Senha alterada com sucesso!" });
  } catch (error) {
    return res.status(400).json({ msg: "Link inválido ou expirado." });
  }
});

export default router;