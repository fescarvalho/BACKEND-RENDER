import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository";

interface UpdateRequest {
  id: number;
  data: {
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
  };
  adminId: number;
}

export class UpdateClientUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: PrismaAuditRepository
  ) {}

  async execute({ id, data, adminId }: UpdateRequest) {
    // 1. Verifica se o usuário existe
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new Error("Usuário não encontrado.");
    }

    // 2. Atualiza os dados
    const updatedUser = await this.userRepository.update(id, data);

    // 3. Salva o Log de Auditoria
    await this.auditRepository.create({
      user_id: adminId,
      acao: "ATUALIZOU_CLIENTE",
      detalhes: `Atualizou dados de: ${userExists.nome} (ID: ${id})`
    });

    return updatedUser;
  }
}