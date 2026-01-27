import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
// ✅ 1. Importar o Repositório de Auditoria
import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository"; 

import { RegisterUseCase } from "../../application/useCases/auth/RegisterUseCase";
import { LoginUseCase } from "../../application/useCases/auth/LoginUseCase"; 
import { AuthController } from "../../infra/http/controllers/AuthController";

export const makeRegisterController = () => {
  const userRepository = new PrismaUserRepository();
  const auditRepository = new PrismaAuditRepository(); 

  const loginUseCase = new LoginUseCase(userRepository, auditRepository);
  const registerUseCase = new RegisterUseCase(userRepository, auditRepository);

  const authController = new AuthController(loginUseCase, registerUseCase);

  return authController;
};