
export interface CreateDocumentDTO {
    titulo: string;
    url: string;
    tamanho_bytes: number;
    formato: string;
    cliente_id: number;
    data_vencimento?: Date | null;
  }
  

export interface ListDocumentsDTO {
  userId: number;
  month?: string; 
  year?: string;  
  page: number;
  limit: number;
}


export interface PaginatedDocuments {
  data: any[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface IDocumentRepository {
  create(data: CreateDocumentDTO): Promise<any>;
  findAll(params: ListDocumentsDTO): Promise<PaginatedDocuments>;
  
  
  findById(id: number): Promise<any | null>; 
  delete(id: number): Promise<void>; 
  count(userId?: number): Promise<number>; 
  sumTotalSize(userId?: number): Promise<number>;
}