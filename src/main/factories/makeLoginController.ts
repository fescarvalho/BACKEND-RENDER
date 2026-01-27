import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
import { LoginUseCase } from "../../application/useCases/auth/LoginUseCase";
import { AuthController } from "../../infra/http/controllers/AuthController";
import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository";

export const makeLoginController = () => {
  const userRepository = new PrismaUserRepository();
  const auditRepository = new PrismaAuditRepository();
  const loginUseCase = new LoginUseCase(userRepository, auditRepository)
  const authController = new AuthController(loginUseCase);

  return authController;
};