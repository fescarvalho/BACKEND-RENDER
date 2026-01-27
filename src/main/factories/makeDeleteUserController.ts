import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
// ✅ 1. Importe o repositório de auditoria
import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository"; 

import { DeleteClientUseCase } from "../../application/useCases/admin/DeleteClientUseCase";
import { DeleteUserController } from "../../infra/http/controllers/DeleteUserController";

export const makeDeleteUserController = () => {
  const userRepository = new PrismaUserRepository();
  const auditRepository = new PrismaAuditRepository(); // ✅ 2. Instancie ele aqui
  
  // ✅ 3. Injete os dois repositórios no caso de uso
  // A ordem deve ser a mesma do construtor: (userRepo, auditRepo)
  const deleteClientUseCase = new DeleteClientUseCase(userRepository, auditRepository);

  const deleteUserController = new DeleteUserController(deleteClientUseCase);

  return deleteUserController;
};