"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentController = void 0;
class DeleteDocumentController {
    constructor(deleteDocumentUseCase) {
        this.deleteDocumentUseCase = deleteDocumentUseCase;
    }
    async handle(req, res) {
        const { id } = req.params; // ID do documento na URL
        const userId = req.userId;
        const userType = req.tipo_usuario; // O middleware de auth precisa salvar isso também
        if (!userId)
            return res.status(401).json({ msg: "Não autenticado" });
        try {
            await this.deleteDocumentUseCase.execute({
                documentId: Number(id),
                userId,
                userType: userType || "cliente",
            });
            return res.status(200).json({ msg: "Documento deletado com sucesso." });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message || "Erro ao deletar." });
        }
    }
}
exports.DeleteDocumentController = DeleteDocumentController;
