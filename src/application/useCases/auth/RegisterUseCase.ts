import bcrypt from "bcryptjs";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// ✅ 1. Importar o Repositório de Auditoria
import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository";

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: PrismaAuditRepository // ✅ 2. Injetar o Audit aqui no construtor
  ) {}

  async execute(data: RegisterRequest) {
    
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error("Este e-mail já está em uso.");
    }

    const salt = await bcrypt.genSalt(8);
    const senhaHash = await bcrypt.hash(data.senha, salt);

    // Cria o usuário no banco
    const newUser = await this.userRepository.create({
      nome: data.nome,
      email: data.email,
      senha_hash: senhaHash, 
      cpf: data.cpf,
      telefone: data.telefone,
      tipo_usuario: "cliente", 
    });

    // ✅ 3. Registrar o Log de Auditoria
    // Usamos o ID do próprio usuário recém-criado
    if (newUser && newUser.id) {
        await this.auditRepository.create({
            user_id: newUser.id,
            acao: "CADASTRO",
            detalhes: `Novo cliente cadastrado: ${newUser.nome} (${newUser.email})`
        });
    }

    const { senha_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}