import { PrismaDocumentRepository } from "../../infra/databases/repositories/PrismaDocumentRepository";
import { ListDocumentsUseCase } from "../../application/useCases/document/ListDocumentsUseCase";
import { ListDocumentsController } from "../../infra/http/controllers/ListDocumentsController";

export const makeListDocumentsController = () => {
  const documentRepository = new PrismaDocumentRepository();
  const listDocumentsUseCase = new ListDocumentsUseCase(documentRepository);
  const listDocumentsController = new ListDocumentsController(listDocumentsUseCase);

  return listDocumentsController;
};