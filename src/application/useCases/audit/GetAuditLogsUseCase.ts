import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository";

interface GetAuditLogsRequest {
  userName?: string;
  startDate?: string;
  endDate?: string;
}

export class GetAuditLogsUseCase {
  constructor(private auditRepository: PrismaAuditRepository) {}

  async execute({ userName, startDate, endDate }: GetAuditLogsRequest) {
    // Converte strings para Date se existirem
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const logs = await this.auditRepository.findAll({
      userName,
      startDate: start,
      endDate: end,
    });

    return logs;
  }
}