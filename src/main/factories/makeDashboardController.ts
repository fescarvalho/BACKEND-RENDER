import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
import { PrismaDocumentRepository } from "../../infra/databases/repositories/PrismaDocumentRepository";
import { GetDashboardStatsUseCase } from "../../application/useCases/admin/GetDashboardStatsUseCase";
import { DashboardController } from "../../infra/http/controllers/DashboardController";

export const makeDashboardController = () => {
  // Instancia os dois repositórios necessários
  const userRepository = new PrismaUserRepository();
  const documentRepository = new PrismaDocumentRepository();

  const useCase = new GetDashboardStatsUseCase(userRepository, documentRepository);
  const controller = new DashboardController(useCase);

  return controller;
};