"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
// REMOVIDO: import { del } from "@vercel/blob";
const storage_1 = require("../services/storage"); // ✅ NOVA IMPORTAÇÃO
const auth_1 = require("../middlewares/auth");
const emailService_1 = require("../services/emailService");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// --- IMPORTAÇÕES DO ZOD ---
const validateResource_1 = require("../middlewares/validateResource");
const authSchemas_1 = require("../schemas/authSchemas");
const router = (0, express_1.Router)();
// --- CONFIGURAÇÕES ---
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: "Muitas tentativas de login. Conta bloqueada temporariamente por 15 minutos.",
});
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_super_secreta_recuperacao";
// --- HELPER: Verificar Admin (Reutilizável) ---
const checkAdmin = async (userId) => {
    const user = await prisma_1.prisma.users.findUnique({
        where: { id: userId },
        select: { tipo_usuario: true },
    });
    return user?.tipo_usuario === "admin";
};
// ======================================================
// 1. REGISTRO
// ======================================================
router.post("/register", (0, validateResource_1.validate)(authSchemas_1.registerSchema), async (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;
    try {
        // Verifica duplicidade (Email ou CPF)
        const usuarioExistente = await prisma_1.prisma.users.findFirst({
            where: {
                OR: [{ email: email }, { cpf: cpf }],
            },
        });
        if (usuarioExistente) {
            if (usuarioExistente.email === email) {
                return res
                    .status(400)
                    .json({ msg: "Este e-mail já está em uso por outra conta." });
            }
            if (usuarioExistente.cpf === cpf) {
                return res.status(400).json({ msg: "Este CPF já está cadastrado no sistema." });
            }
        }
        // Cria Hash e Salva
        const salt = await bcryptjs_1.default.genSalt(10);
        const senhaHash = await bcryptjs_1.default.hash(senha, salt);
        const novoUsuario = await prisma_1.prisma.users.create({
            data: {
                nome,
                email,
                senha_hash: senhaHash,
                cpf,
                telefone,
                tipo_usuario: "cliente",
            },
            select: { id: true, nome: true, email: true, telefone: true },
        });
        return res.json({ msg: "Usuário criado com segurança!", user: novoUsuario });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Erro ao cadastrar" });
    }
});
// ======================================================
// 2. LOGIN
// ======================================================
router.post("/login", (0, validateResource_1.validate)(authSchemas_1.loginSchema), loginLimiter, async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await prisma_1.prisma.users.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(400).json({ msg: "E-mail ou senha incorretos." });
        }
        const senhaBate = await bcryptjs_1.default.compare(senha, user.senha_hash);
        if (!senhaBate) {
            return res.status(400).json({ msg: "E-mail ou senha incorretos." });
        }
        // Gera Token
        const secret = process.env.JWT_SECRET || "segredo_padrao_teste";
        const token = jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "1h" });
        return res.json({
            msg: "Logado com sucesso!",
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                cpf: user.cpf,
                tipo_usuario: user.tipo_usuario,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Erro no servidor" });
    }
});
// ======================================================
// 3. LISTAR CLIENTES (Admin)
// ======================================================
router.get("/clientes", auth_1.verificarToken, async (req, res) => {
    try {
        if (!req.userId || !(await checkAdmin(req.userId))) {
            return res.status(403).json({ msg: "Acesso negado" });
        }
        const clientes = await prisma_1.prisma.users.findMany({
            where: { tipo_usuario: "cliente" },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, email: true, cpf: true, telefone: true },
        });
        return res.json(clientes);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Erro ao listar clientes" });
    }
});
// ======================================================
// 4. DELETAR USUÁRIO (ATUALIZADO PARA R2) ✅
// ======================================================
router.delete("/users/:id", auth_1.verificarToken, async (req, res) => {
    const { id } = req.params;
    const solicitanteId = req.userId;
    try {
        if (!solicitanteId || !(await checkAdmin(solicitanteId))) {
            return res.status(403).json({ msg: "Acesso negado. Apenas administradores." });
        }
        if (id === String(solicitanteId)) {
            return res.status(400).json({ msg: "Você não pode deletar sua própria conta." });
        }
        // 1. Busca arquivos do cliente para apagar do Cloudflare R2
        // ATENÇÃO: Verifique se no seu banco o campo é 'userId' ou 'user_id'
        // Mantive 'user_id' conforme seu código original.
        const arquivosDoCliente = await prisma_1.prisma.documents.findMany({
            where: { user_id: Number(id) },
            select: { url_arquivo: true },
        });
        // 2. Apaga arquivos do R2 em paralelo (Muito mais rápido)
        if (arquivosDoCliente.length > 0) {
            console.log(`🗑️ Apagando ${arquivosDoCliente.length} arquivos do Storage...`);
            const promises = arquivosDoCliente
                .filter(doc => doc.url_arquivo) // Filtra se tiver url nula
                .map(doc => (0, storage_1.deleteFromR2)(doc.url_arquivo)); // Chama a função nova
            await Promise.all(promises);
        }
        // 3. Apaga Notificações (Opcional, se não tiver Cascade no banco)
        await prisma_1.prisma.notifications.deleteMany({
            where: { user_id: Number(id) }
        });
        // 4. Apaga registros de documentos no banco
        await prisma_1.prisma.documents.deleteMany({
            where: { user_id: Number(id) },
        });
        // 5. Apaga o usuário
        try {
            const usuarioDeletado = await prisma_1.prisma.users.delete({
                where: { id: Number(id) },
                select: { nome: true },
            });
            return res.json({
                msg: `Usuário ${usuarioDeletado.nome} e todos os seus arquivos foram removidos com sucesso.`,
            });
        }
        catch (e) {
            if (e.code === "P2025") {
                return res.status(404).json({ msg: "Usuário não encontrado." });
            }
            throw e;
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Erro ao deletar usuário." });
    }
});
// ======================================================
// 5. ATUALIZAR USUÁRIO
// ======================================================
router.put("/users/:id", auth_1.verificarToken, async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, telefone } = req.body;
    try {
        if (!req.userId || !(await checkAdmin(req.userId))) {
            return res.status(403).json({ msg: "Acesso negado. Apenas administradores." });
        }
        const updatedUser = await prisma_1.prisma.users.update({
            where: { id: Number(id) },
            data: { nome, email, cpf, telefone },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                telefone: true,
                tipo_usuario: true,
            },
        });
        return res.json({
            msg: "Dados atualizados com sucesso!",
            user: updatedUser,
        });
    }
    catch (err) {
        console.error(err);
        if (err.code === "P2002") {
            return res
                .status(400)
                .json({ msg: "Erro: Email ou CPF já cadastrado em outra conta." });
        }
        if (err.code === "P2025") {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }
        return res.status(500).json({ msg: "Erro ao atualizar usuário." });
    }
});
// ======================================================
// 6. ESQUECI A SENHA
// ======================================================
router.post("/forgot-password", (0, validateResource_1.validate)(authSchemas_1.forgotPasswordSchema), async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma_1.prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ msg: "E-mail não encontrado." });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        const link = `https://leandro-abreu-contabilidade.vercel.app/redefinir-senha?token=${token}`;
        console.log(`Enviando para ${email}...`);
        const sucesso = await (0, emailService_1.enviarEmailRecuperacao)(email, link);
        if (sucesso) {
            return res.json({ msg: "Link de recuperação enviado para seu e-mail!" });
        }
        else {
            return res
                .status(500)
                .json({ msg: "Erro ao enviar e-mail. Tente novamente mais tarde." });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro interno." });
    }
});
// ======================================================
// 7. RESETAR SENHA
// ======================================================
router.post("/reset-password", (0, validateResource_1.validate)(authSchemas_1.resetPasswordSchema), async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // 1. Valida Token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const email = decoded.email;
        // 2. Criptografa Nova Senha
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash(newPassword, salt);
        // 3. Atualiza Banco
        await prisma_1.prisma.users.update({
            where: { email: email },
            data: { senha_hash: hash },
        });
        return res.json({ msg: "Senha alterada com sucesso!" });
    }
    catch (error) {
        console.error("❌ ERRO NO RESET:", error);
        return res.status(400).json({ msg: "O link expirou ou é inválido. Peça um novo." });
    }
});
exports.default = router;
