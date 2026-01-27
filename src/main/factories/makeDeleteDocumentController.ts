import { PrismaDocumentRepository } from "../../infra/databases/repositories/PrismaDocumentRepository";
import { R2StorageProvider } from "../../infra/providers/storage/R2StorageProvider";
import { DeleteDocumentUseCase } from "../../application/useCases/document/DeleteDocumentUseCase";
import { DeleteDocumentController } from "../../infra/http/controllers/DeleteDocumentController";

export const makeDeleteDocumentController = () => {
  const repository = new PrismaDocumentRepository();
  const storage = new R2StorageProvider();
  
  const useCase = new DeleteDocumentUseCase(repository, storage);
  const controller = new DeleteDocumentController(useCase);

  return controller;
};