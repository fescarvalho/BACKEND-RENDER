"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDocumentRepository = void 0;
const client_1 = require("../prisma/client");
class PrismaDocumentRepository {
    async create(data) {
        return await client_1.prisma.documents.create({
            data: {
                titulo: data.titulo,
                url_arquivo: data.url,
                tamanho_bytes: data.tamanho_bytes,
                formato: data.formato,
                data_vencimento: data.data_vencimento,
                user_id: data.cliente_id,
            },
        });
    }
    async findAll({ userId, month, year, page, limit }) {
        const where = {
            user_id: userId, // Filtra pelo usuário logado
        };
        // Lógica de filtro por data (Mês e Ano)
        if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
            where.data_upload = {
                gte: startDate,
                lte: endDate,
            };
        }
        // Busca total de registros (para calcular páginas)
        const total = await client_1.prisma.documents.count({ where });
        // Busca os dados paginados
        const documents = await client_1.prisma.documents.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { data_upload: "desc" }, // Mais recentes primeiro
        });
        return {
            data: documents,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        return await client_1.prisma.documents.findUnique({
            where: { id },
        });
    }
    async delete(id) {
        await client_1.prisma.documents.delete({
            where: { id },
        });
    }
    async count(userId) {
        const where = userId ? { user_id: userId } : {};
        return await client_1.prisma.documents.count({ where });
    }
    async sumTotalSize(userId) {
        const where = userId ? { user_id: userId } : {};
        const aggregate = await client_1.prisma.documents.aggregate({
            _sum: {
                tamanho_bytes: true,
            },
            where,
        });
        // Prisma retorna BigInt ou null. Convertemos para Number (Seguro até 9 Petabytes)
        return Number(aggregate._sum.tamanho_bytes || 0);
    }
}
exports.PrismaDocumentRepository = PrismaDocumentRepository;
