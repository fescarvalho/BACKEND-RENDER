import { prisma } from "../prisma/client"; 

export class PrismaAuditRepository {
  async findAll(filters: { userName?: string; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.userName) {
      where.user = {
        nome: {
          contains: filters.userName,
          mode: "insensitive",
        },
      };
    }

    if (filters.startDate || filters.endDate) {
      where.criado_em = {};
      if (filters.startDate) where.criado_em.gte = filters.startDate;
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.criado_em.lte = end;
      }
    }

    // ⚠️ CORREÇÃO: mudou de .audit_logs para .auditLog
    return await prisma.auditLog.findMany({
      where,
      orderBy: { criado_em: "desc" },
      include: {
        user: {
          select: { id: true, nome: true, email: true },
        },
      },
    });
  }

  async create(data: { user_id: number; acao: string; detalhes?: string }) {
    try {
      // ⚠️ CORREÇÃO: mudou de .audit_logs para .auditLog
      await prisma.auditLog.create({
        data: {
          user_id: data.user_id,
          acao: data.acao,
          detalhes: data.detalhes || "",
        },
      });
    } catch (error) {
      console.error("❌ Falha ao criar log de auditoria:", error);
    }
  }
}