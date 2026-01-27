"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("../prisma/client");
class PrismaUserRepository {
    async findByEmail(email) {
        return await client_1.prisma.users.findUnique({ where: { email } });
    }
    // ✅ IMPLEMENTAÇÃO DO CREATE
    async create(data) {
        return await client_1.prisma.users.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha_hash: data.senha_hash, // Note que o prisma espera o hash, não a senha crua
                cpf: data.cpf,
                telefone: data.telefone,
                tipo_usuario: data.tipo_usuario || "cliente",
            },
        });
    }
    async findById(id) {
        return await client_1.prisma.users.findUnique({ where: { id } });
    }
    async findAll(search) {
        const where = {
            tipo_usuario: "cliente", // Admin não vê outros admins na lista (regra opcional)
        };
        if (search) {
            where.nome = {
                contains: search,
                // mode: "insensitive", // Descomente se seu banco for Postgres
            };
        }
        return await client_1.prisma.users.findMany({
            where,
            orderBy: { nome: "asc" },
        });
    }
    async delete(id) {
        // Atenção: O Prisma deleta em cascata se configurado no schema,
        // senão precisaremos deletar documentos manualmente antes.
        await client_1.prisma.users.delete({ where: { id } });
    }
    async count() {
        return await client_1.prisma.users.count({
            where: { tipo_usuario: "cliente" } // Conta apenas clientes
        });
    }
    async update(id, data) {
        await client_1.prisma.users.update({
            where: { id },
            data,
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
