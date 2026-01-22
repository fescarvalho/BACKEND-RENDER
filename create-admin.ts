import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaForte = await bcrypt.hash("123456", 10);

  await prisma.users.create({
    data: {
      nome: "Super Admin",
      email: "supervisor@admin.com",
      senha_hash: senhaForte,
      tipo_usuario: "admin", // O segredo está aqui
      cpf: "00000000000",
      telefone: "000000000"
    },
  });

  console.log("✅ Admin criado com sucesso!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());