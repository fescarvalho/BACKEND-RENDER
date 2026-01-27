import { prisma } from "../prisma/client";
import { 
  IDocumentRepository, 
  CreateDocumentDTO, 
  ListDocumentsDTO, 
  PaginatedDocuments 
} from "../../../domain/repositories/IDocumentRepository";

export class PrismaDocumentRepository implements IDocumentRepository {
  
  async create(data: CreateDocumentDTO): Promise<any> {
    return await prisma.documents.create({
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

  async findAll({ userId, month, year, page, limit }: ListDocumentsDTO): Promise<PaginatedDocuments> {
    const where: any = {
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
    const total = await prisma.documents.count({ where });

    // Busca os dados paginados
    const documents = await prisma.documents.findMany({
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

  async findById(id: number): Promise<any | null> {
    if (!id || isNaN(id)) {
      console.error("❌ Erro: findById recebeu um ID inválido:", id);
      return null; 
  }

  return await prisma.users.findUnique({
    where: {
      id: id, // Certifique-se que aqui é a variável 'id', e não o tipo 'Int'
    },
  });
  }

  async delete(id: number): Promise<void> {
    await prisma.documents.delete({
      where: { id },
    });
  }
  
  async count(userId?: number): Promise<number> {
    const where = userId ? { user_id: userId } : {};
    return await prisma.documents.count({ where });
  }
  
  async sumTotalSize(userId?: number): Promise<number> {
    const where = userId ? { user_id: userId } : {};
  
    const aggregate = await prisma.documents.aggregate({
      _sum: {
        tamanho_bytes: true,
      },
      where,
    });
  
    // Prisma retorna BigInt ou null. Convertemos para Number (Seguro até 9 Petabytes)
    return Number(aggregate._sum.tamanho_bytes || 0);
  }
}