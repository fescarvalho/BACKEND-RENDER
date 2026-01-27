import { PrismaDocumentRepository } from "../../infra/databases/repositories/PrismaDocumentRepository";
import { ListDocumentsUseCase } from "../../application/useCases/document/ListDocumentsUseCase";
import { AdminListDocsController } from "../../infra/http/controllers/AdminListDocsController";

export const makeAdminListDocsController = () => {
  const repository = new PrismaDocumentRepository();
  
  const useCase = new ListDocumentsUseCase(repository); 
  const controller = new AdminListDocsController(useCase);

  return controller;
};