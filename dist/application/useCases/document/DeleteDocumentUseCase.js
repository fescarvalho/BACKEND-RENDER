"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentUseCase = void 0;
class DeleteDocumentUseCase {
    constructor(documentRepository, storageProvider) {
        this.documentRepository = documentRepository;
        this.storageProvider = storageProvider;
    }
    async execute({ documentId, userId, userType }) {
        // 1. Busca o documento
        const document = await this.documentRepository.findById(documentId);
        if (!document) {
            throw new Error("Documento não encontrado.");
        }
        // 2. Segurança: Se não for admin, só pode deletar se for o dono
        // Verifica se o campo no banco é 'user_id' ou 'cliente_id' (ajuste conforme seu prisma)
        if (userType !== "admin" && document.user_id !== userId) {
            throw new Error("Você não tem permissão para deletar este documento.");
        }
        // 3. Deleta do Storage (R2)
        // O provider já sabe extrair a Key da URL pública
        if (document.url_arquivo) {
            await this.storageProvider.delete(document.url_arquivo);
        }
        // 4. Deleta do Banco de Dados
        await this.documentRepository.delete(documentId);
    }
}
exports.DeleteDocumentUseCase = DeleteDocumentUseCase;
