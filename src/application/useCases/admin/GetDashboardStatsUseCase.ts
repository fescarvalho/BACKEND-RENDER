import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";

interface Request {
  userId: number;
  userType: string;
}

export class GetDashboardStatsUseCase {
  constructor(
    private userRepository: IUserRepository,
    private documentRepository: IDocumentRepository
  ) {}

  async execute({ userId, userType }: Request) {
    
    if (userType === "admin") {
      const totalClients = await this.userRepository.count();
      const totalDocuments = await this.documentRepository.count();
      const totalStorage = await this.documentRepository.sumTotalSize();

      return {
        role: "admin",
        cards: {
          clientes: totalClients,
          documentos: totalDocuments,
          storage_bytes: totalStorage,
        },
      };
    }

    
    const myDocuments = await this.documentRepository.count(userId);
    const myStorage = await this.documentRepository.sumTotalSize(userId);

    return {
      role: "cliente",
      cards: {
        documentos: myDocuments,
        storage_bytes: myStorage,
      },
    };
  }
}