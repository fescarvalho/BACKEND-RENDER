import { Request, Response } from "express";
import { GetAuditLogsUseCase } from "../../../application/useCases/audit/GetAuditLogsUseCase";

export class GetAuditLogsController {
  constructor(private getAuditLogsUseCase: GetAuditLogsUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { userName, startDate, endDate } = req.query;

      const logs = await this.getAuditLogsUseCase.execute({
        userName: userName as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.status(200).json({ data: logs });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ msg: "Erro ao buscar logs de auditoria." });
    }
  }
}