"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(listClientsUseCase, deleteClientUseCase) {
        this.listClientsUseCase = listClientsUseCase;
        this.deleteClientUseCase = deleteClientUseCase;
    }
    async list(req, res) {
        try {
            const { nome } = req.query; // ?nome=Fulano
            const clients = await this.listClientsUseCase.execute(nome ? String(nome) : undefined);
            return res.json(clients);
        }
        catch (error) {
            return res.status(500).json({ msg: "Erro ao listar clientes." });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.deleteClientUseCase.execute(Number(id));
            return res.json({ msg: "Cliente excluído com sucesso." });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }
}
exports.AdminController = AdminController;
