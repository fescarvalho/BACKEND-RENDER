"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
class DashboardController {
    constructor(getDashboardStatsUseCase) {
        this.getDashboardStatsUseCase = getDashboardStatsUseCase;
    }
    async handle(req, res) {
        try {
            const userId = req.userId;
            const userType = req.tipo_usuario;
            if (!userId || !userType) {
                return res.status(401).json({ msg: "Não autenticado." });
            }
            const stats = await this.getDashboardStatsUseCase.execute({
                userId,
                userType,
            });
            return res.json(stats);
        }
        catch (error) {
            return res.status(500).json({ msg: "Erro ao carregar dashboard." });
        }
    }
}
exports.DashboardController = DashboardController;
