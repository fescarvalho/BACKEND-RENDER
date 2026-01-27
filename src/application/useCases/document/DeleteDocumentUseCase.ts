import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";
import { IStorageProvider } from "../../../domain/providers/IStorageProvider";

interface DeleteDocumentRequest {
  documentId: number;
  userId: number;       
  userType: string;     
}

export class DeleteDocumentUseCase {
  constructor(
    private documentRepository: IDocumentRepository,
    private storageProvider: IStorageProvider
  ) {}

  async execute({ documentId, userId, userType }: DeleteDocumentRequest) {
    
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new Error("Documento não encontrado.");
    }

    
    
    if (userType !== "admin" && document.user_id !== userId) {
      throw new Error("Você não tem permissão para deletar este documento.");
    }

    
    
    if (document.url_arquivo) {
      await this.storageProvider.delete(document.url_arquivo);
    }

    
    await this.documentRepository.delete(documentId);
  }
}