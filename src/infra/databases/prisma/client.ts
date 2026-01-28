import { PrismaClient } from "@prisma/client";

// Evita múltiplas instâncias no hot-reload em desenvolvimento
// E garante instância única em produção

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error"], // Ajuda a ver os logs que você me mandou
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;