import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// 1. Import mantido
import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository";

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  user: {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: string;
  };
  token: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: PrismaAuditRepository // ✅ 2. Injetamos o Repositório aqui
  ) {}

  async execute({ email, senha }: LoginRequest): Promise<LoginResponse> {
    
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail ou senha incorretos.");
    }
    
    const isPasswordValid = await bcrypt.compare(senha, user.senha_hash || user.senha);

    if (!isPasswordValid) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const secret = process.env.JWT_SECRET || "segredo_padrao_teste";
    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
      },
      secret,
      { expiresIn: "1d" } 
    );

    // ✅ 3. REGISTRAMOS O LOG DE SUCESSO
    // Importante: fazemos isso antes do retorno
    await this.auditRepository.create({
      user_id: user.id,
      acao: "LOGIN",
      detalhes: "Login realizado com sucesso via Web"
    });
    
    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
      },
      token,
    };
  }
}