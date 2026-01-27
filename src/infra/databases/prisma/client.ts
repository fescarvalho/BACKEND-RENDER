import { PrismaClient } from "@prisma/client";

// Evita erros de tipagem com o objeto global
declare global {
  var prisma: PrismaClient | undefined;
}

// Se já existir uma conexão global, usa ela. Se não, cria uma nova.
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error'], // Opcional: Ajuda a ver os erros no console
});

// Em desenvolvimento, salva a conexão na variável global para reuso
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}