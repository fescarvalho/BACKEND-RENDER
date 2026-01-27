import { prisma } from "../prisma/client";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";


export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<any | null> {
    return await prisma.users.findUnique({ where: { email } });
  }

  
  async create(data: any): Promise<any> {
    return await prisma.users.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha_hash: data.senha_hash, 
        cpf: data.cpf,
        telefone: data.telefone,
        tipo_usuario: data.tipo_usuario || "cliente",
      },
    });
  }

  async findById(id: number): Promise<any | null> {
   
    if (!id || isNaN(id)) {
      console.warn(`⚠️ findById recebeu ID inválido: ${id}`);
      return null;
    }

    return await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll(search?: string): Promise<any[]> {
    const where: any = {
      tipo_usuario: "cliente", 
    };

    if (search) {
      where.nome = {
        contains: search,
        mode: "insensitive", 
      };
    }

    return await prisma.users.findMany({
      where,
      orderBy: { nome: "asc" },
    });
  }

  async delete(id: number): Promise<void> {
    
    
    await prisma.users.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return await prisma.users.count({
      where: { tipo_usuario: "cliente" } 
    });
  }
  async update(id: number, data: any): Promise<void> {
    await prisma.users.update({
      where: { id },
      data,
    });
  }
}