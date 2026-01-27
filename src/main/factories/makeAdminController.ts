import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
// ✅ 1. Importar o Repositório de Auditoria
import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository"; 

import { UpdateClientUseCase } from "../../application/useCases/admin/UpdateClientUseCase";
import { ListClientsUseCase } from "../../application/useCases/admin/ListClientsUseCase";
import { DeleteClientUseCase } from "../../application/useCases/admin/DeleteClientUseCase";
import { AdminController } from "../../infra/http/controllers/AdminController";

export const makeAdminController = () => {
  const userRepository = new PrismaUserRepository();
  const auditRepository = new PrismaAuditRepository(); // ✅ 2. Instanciar a Auditoria
  const updateClientUseCase = new UpdateClientUseCase(userRepository, auditRepository);
  const listClientsUseCase = new ListClientsUseCase(userRepository);

  // ✅ 3. Injetar (userRepository, auditRepository)
  // Agora passamos os dois repositórios que o UseCase pede
  const deleteClientUseCase = new DeleteClientUseCase(userRepository, auditRepository);

  const adminController = new AdminController(
    listClientsUseCase,
    deleteClientUseCase,
    updateClientUseCase
  );

  return adminController;
};