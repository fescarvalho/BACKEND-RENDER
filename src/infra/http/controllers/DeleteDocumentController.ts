import { Request, Response } from "express";
import { DeleteDocumentUseCase } from "../../../application/useCases/document/DeleteDocumentUseCase";

export class DeleteDocumentController {
  constructor(private deleteDocumentUseCase: DeleteDocumentUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      
      // 1. Validação de Segurança do ID (Evita crash do Prisma)
      const documentId = Number(id);
      if (!documentId || isNaN(documentId)) {
        return res.status(400).json({ msg: "ID do documento inválido." });
      }

      // 2. Padronização do User ID
      // No UploadController usamos 'user_id'. Vamos manter o padrão.
      // O cast (req as any) evita erros de TypeScript se a tipagem global não estiver configurada.
      const userId = Number((req as any).user_id);
      const userType = (req as any).tipo_usuario; 
      
      if (!userId) {
        return res.status(401).json({ msg: "Não autenticado." });
      }

      // 3. Execução
      await this.deleteDocumentUseCase.execute({
        documentId: documentId,
        userId,
        userType: userType || "cliente",
      });

      return res.status(200).json({ msg: "Documento deletado com sucesso." });
      
    } catch (error: any) {
      console.error("Erro ao deletar documento:", error);
      return res.status(400).json({ msg: error.message || "Erro ao deletar." });
    }
  }
}