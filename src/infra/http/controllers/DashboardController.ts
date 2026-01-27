import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { GetDashboardStatsUseCase } from "../../../application/useCases/admin/GetDashboardStatsUseCase";

export class DashboardController {
  constructor(private getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

  async handle(req: AuthRequest, res: Response) {
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
    } catch (error: any) {
      return res.status(500).json({ msg: "Erro ao carregar dashboard." });
    }
  }
}