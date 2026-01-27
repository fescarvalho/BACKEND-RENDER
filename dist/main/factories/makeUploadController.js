"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUploadController = void 0;
const R2StorageProvider_1 = require("../../infra/providers/storage/R2StorageProvider");
const PrismaDocumentRepository_1 = require("../../infra/databases/repositories/PrismaDocumentRepository");
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository"); // ✅ Novo
const NodemailerProvider_1 = require("../../infra/providers/mail/NodemailerProvider"); // ✅ Novo
const UploadDocumentUseCase_1 = require("../../application/useCases/document/UploadDocumentUseCase");
const UploadDocumentController_1 = require("../../infra/http/controllers/UploadDocumentController");
const makeUploadController = () => {
    const storageProvider = new R2StorageProvider_1.R2StorageProvider();
    const documentRepository = new PrismaDocumentRepository_1.PrismaDocumentRepository();
    // ✅ Instanciamos as novas dependências
    const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const mailProvider = new NodemailerProvider_1.NodemailerProvider();
    // ✅ Injetamos tudo no UseCase
    const uploadDocumentUseCase = new UploadDocumentUseCase_1.UploadDocumentUseCase(storageProvider, documentRepository, userRepository, mailProvider);
    const uploadDocumentController = new UploadDocumentController_1.UploadDocumentController(uploadDocumentUseCase);
    return uploadDocumentController;
};
exports.makeUploadController = makeUploadController;
