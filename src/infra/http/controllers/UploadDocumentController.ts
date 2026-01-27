import { Request, Response } from "express";
import { UploadDocumentUseCase } from "../../../application/useCases/document/UploadDocumentUseCase";

export class UploadDocumentController {
  constructor(private uploadDocumentUseCase: UploadDocumentUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      // 1. Validação básica de arquivo
      if (!req.file) {
        return res.status(400).json({ msg: "Nenhum arquivo enviado." });
      }

      const { officeId, titulo, vencimento } = req.body;

      // Validação de segurança
      if (!officeId) {
        return res.status(400).json({ msg: "ID do cliente (officeId) é obrigatório." });
      }

      // 2. Chama o Caso de Uso
      const document = await this.uploadDocumentUseCase.execute({
        file: {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        officeId: Number(officeId), 
        
      
        userId: Number((req as any).user_id), 
        
        titulo: titulo || req.file.originalname,
        vencimento,
      });

      return res.status(201).json({ 
        msg: "Upload realizado com sucesso!", 
        documento: document 
      });

    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ 
        msg: error.message || "Erro inesperado no upload." 
      });
    }
  }
}