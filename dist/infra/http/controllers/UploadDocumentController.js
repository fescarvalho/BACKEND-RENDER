"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocumentController = void 0;
class UploadDocumentController {
    constructor(uploadDocumentUseCase) {
        this.uploadDocumentUseCase = uploadDocumentUseCase;
    }
    async handle(req, res) {
        try {
            // 1. Validação básica de arquivo
            if (!req.file) {
                return res.status(400).json({ msg: "Nenhum arquivo enviado." });
            }
            const { cliente_id, vencimento } = req.body;
            // 2. Chama o Caso de Uso
            // Note que o Controller converte os dados 'crus' do Express para o formato que o UseCase entende
            const document = await this.uploadDocumentUseCase.execute({
                file: {
                    buffer: req.file.buffer,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                },
                officeId: String(cliente_id), // Garante string para o caminho do R2
                userId: String(cliente_id), // Neste caso, office e user são o mesmo contexto
                vencimento,
            });
            return res.status(201).json({
                msg: "Upload realizado com sucesso!",
                documento: document
            });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                msg: error.message || "Erro inesperado no upload."
            });
        }
    }
}
exports.UploadDocumentController = UploadDocumentController;
