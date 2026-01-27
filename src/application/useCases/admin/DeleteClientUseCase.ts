import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// 1. Importar o Repositório de Auditoria
import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository";

// Definimos uma interface para facilitar a passagem de dados
interface DeleteClientRequest {
  id: number;       // ID do cliente que será excluído
  adminId: number;  // ID do supervisor que está excluindo
}

export class DeleteClientUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: PrismaAuditRepository // 2. Injetar no construtor
  ) {}

  // Agora o método espera receber também QUEM está deletando (adminId)
  async execute({ id, adminId }: DeleteClientRequest) {
    
    // Busca o usuário para pegar o nome dele (para o log ficar bonito)
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // 3. Deleta o usuário
    await this.userRepository.delete(id);

    // 4. Cria o Log de Auditoria
    // Importante: user_id aqui é o ID do ADMIN, pois foi ele quem fez a ação
    await this.auditRepository.create({
        user_id: adminId, 
        acao: "DELETOU_CLIENTE",
        detalhes: `Excluiu o cliente: ${user.nome} (Email: ${user.email})`
    });
  }
}