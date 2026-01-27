"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteDocumentController = void 0;
const PrismaDocumentRepository_1 = require("../../infra/databases/repositories/PrismaDocumentRepository");
const R2StorageProvider_1 = require("../../infra/providers/storage/R2StorageProvider");
const DeleteDocumentUseCase_1 = require("../../application/useCases/document/DeleteDocumentUseCase");
const DeleteDocumentController_1 = require("../../infra/http/controllers/DeleteDocumentController");
const makeDeleteDocumentController = () => {
    const repository = new PrismaDocumentRepository_1.PrismaDocumentRepository();
    const storage = new R2StorageProvider_1.R2StorageProvider();
    const useCase = new DeleteDocumentUseCase_1.DeleteDocumentUseCase(repository, storage);
    const controller = new DeleteDocumentController_1.DeleteDocumentController(useCase);
    return controller;
};
exports.makeDeleteDocumentController = makeDeleteDocumentController;
