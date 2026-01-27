import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { ListDocumentsUseCase } from "../../../application/useCases/document/ListDocumentsUseCase";

export class AdminListDocsController {
  constructor(private listDocumentsUseCase: ListDocumentsUseCase) {}

  async handle(req: AuthRequest, res: Response) {
    try {
      // 1. Pega o ID do cliente pela URL (ex: /clientes/38/documentos)
      const { id } = req.params;
      
      // 2. Pega filtros opcionais (mês, ano, paginação)
      const { page = "1", limit = "10", month, year } = req.query;

      // 3. Chama o UseCase passando o ID que veio na URL (e não o do token)
      const result = await this.listDocumentsUseCase.execute({
        userId: Number(id),
        page: Number(page),
        limit: Number(limit),
        month: month ? String(month) : undefined,
        year: year ? String(year) : undefined,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao listar documentos do cliente." });
    }
  }
}