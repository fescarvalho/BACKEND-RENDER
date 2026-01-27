import { R2StorageProvider } from "../../infra/providers/storage/R2StorageProvider";
import { PrismaDocumentRepository } from "../../infra/databases/repositories/PrismaDocumentRepository";
import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository"; 
import { NodemailerProvider } from "../../infra/providers/mail/NodemailerProvider"; 
import { UploadDocumentUseCase } from "../../application/useCases/document/UploadDocumentUseCase";
import { UploadDocumentController } from "../../infra/http/controllers/UploadDocumentController";
import { PrismaAuditRepository } from "../../infra/databases/repositories/PrismaAuditRepository";


export const makeUploadController = () => {
  const storageProvider = new R2StorageProvider();
  const documentRepository = new PrismaDocumentRepository();
  
  const auditRepository = new PrismaAuditRepository();
  const userRepository = new PrismaUserRepository();
  const mailProvider = new NodemailerProvider();

  
  const uploadDocumentUseCase = new UploadDocumentUseCase(
    storageProvider,
    documentRepository,
    userRepository,
    mailProvider,
    auditRepository
  );

  const uploadDocumentController = new UploadDocumentController(
    uploadDocumentUseCase
  );

  return uploadDocumentController;
};