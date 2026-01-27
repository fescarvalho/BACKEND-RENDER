import { Request, Response } from "express";
import { DeleteClientUseCase } from "../../../application/useCases/admin/DeleteClientUseCase";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteClientUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      // 1. Pegamos o ID da URL (quem será deletado)
      const { id } = req.params;
      const idNumber = Number(id);

      // 2. Pegamos o ID do Admin (quem está logado)
      // Ajuste conforme seu middleware (pode ser req.userId ou req.user_id)
      const adminId = Number((req as any).user_id || (req as any).userId);

      // Validação
      if (!idNumber || isNaN(idNumber)) {
        return res.status(400).json({ msg: "ID do cliente inválido." });
      }

      if (!adminId || isNaN(adminId)) {
        return res.status(401).json({ msg: "Não autenticado." });
      }

      // 3. Execução
      // ⚠️ CORREÇÃO AQUI: A propriedade deve se chamar 'id' para bater com a Interface
      await this.deleteUserUseCase.execute({
        id: idNumber, // Antes estava 'targetId', mudamos para 'id'
        adminId: adminId
      });

      return res.status(200).json({ msg: "Usuário deletado com sucesso." });
      
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ msg: error.message || "Erro ao deletar usuário." });
    }
  }
}