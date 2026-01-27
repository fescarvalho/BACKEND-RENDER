"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDocumentsController = void 0;
class ListDocumentsController {
    constructor(listDocumentsUseCase) {
        this.listDocumentsUseCase = listDocumentsUseCase;
    }
    // ✅ 2. Use 'AuthRequest' no lugar de 'Request'
    async handle(req, res) {
        try {
            // ✅ 3. Agora o TypeScript reconhece o userId!
            // (O middleware auth.ts preenche req.userId, não req.cliente_id)
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ msg: "Usuário não autenticado." });
            }
            const { page = "1", limit = "10", month, year } = req.query;
            const result = await this.listDocumentsUseCase.execute({
                userId: Number(userId),
                page: Number(page),
                limit: Number(limit),
                month: month ? String(month) : undefined,
                year: year ? String(year) : undefined,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Erro ao listar documentos." });
        }
    }
}
exports.ListDocumentsController = ListDocumentsController;
