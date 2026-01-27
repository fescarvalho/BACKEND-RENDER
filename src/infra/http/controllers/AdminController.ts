import { Request, Response } from "express";
import { ListClientsUseCase } from "../../../application/useCases/admin/ListClientsUseCase";
import { DeleteClientUseCase } from "../../../application/useCases/admin/DeleteClientUseCase";
import { UpdateClientUseCase } from "../../../application/useCases/admin/UpdateClientUseCase";

export class AdminController {
  constructor(
    private listClientsUseCase: ListClientsUseCase,
    private deleteClientUseCase: DeleteClientUseCase,
    private updateClientUseCase: UpdateClientUseCase
  ) {}

  // ✅ CORREÇÃO 1: Renomeado de 'index' para 'list'
  async list(req: Request, res: Response) {
    try {
      // Pega o termo de busca da URL (ex: ?search=joao)
      const search = req.query.search as string;
      
      const clients = await this.listClientsUseCase.execute(search);
      
      return res.json(clients);
    } catch (error: any) {
      return res.status(400).json({ msg: error.message || "Erro ao listar clientes." });
    }
  }

  // ✅ CORREÇÃO 2: Método Delete com os ajustes de log que fizemos antes
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const targetId = Number(id);

      // Pega o ID do Admin logado para o log de auditoria
      // (O cast 'as any' evita erro de TS se o tipo Request não estiver estendido)
      const adminId = Number((req as any).user_id || (req as any).userId);

      if (!targetId || isNaN(targetId)) {
        return res.status(400).json({ msg: "ID do cliente inválido." });
      }

      // Executa passando o objeto { id, adminId }
      await this.deleteClientUseCase.execute({
        id: targetId,
        adminId: adminId || 0 
      });

      return res.status(200).json({ msg: "Cliente deletado com sucesso." });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message || "Erro ao deletar cliente." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body; // Dados vindos do formulário
      const targetId = Number(id);
      const adminId = Number((req as any).user_id || (req as any).userId);

      if (!targetId || isNaN(targetId)) {
        return res.status(400).json({ msg: "ID inválido." });
      }

      const updatedUser = await this.updateClientUseCase.execute({
        id: targetId,
        data,
        adminId: adminId || 0
      });

      return res.status(200).json({ msg: "Atualizado com sucesso", user: updatedUser });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message || "Erro ao atualizar." });
    }
  }
}