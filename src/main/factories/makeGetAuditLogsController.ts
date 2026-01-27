import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository";
import { GetAuditLogsUseCase } from "../../application/useCases/audit/GetAuditLogsUseCase";
import { GetAuditLogsController } from "../../infra/http/controllers/GetAuditLogsController";

export const makeGetAuditLogsController = () => {
  const repository = new PrismaAuditRepository();
  const useCase = new GetAuditLogsUseCase(repository);
  const controller = new GetAuditLogsController(useCase);
  return controller;
};