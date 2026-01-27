"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdminListDocsController = void 0;
const PrismaDocumentRepository_1 = require("../../infra/databases/repositories/PrismaDocumentRepository");
const ListDocumentsUseCase_1 = require("../../application/useCases/document/ListDocumentsUseCase");
const AdminListDocsController_1 = require("../../infra/http/controllers/AdminListDocsController");
const makeAdminListDocsController = () => {
    const repository = new PrismaDocumentRepository_1.PrismaDocumentRepository();
    // Reutilizamos o mesmo UseCase, pois a regra de listar é a mesma!
    const useCase = new ListDocumentsUseCase_1.ListDocumentsUseCase(repository);
    const controller = new AdminListDocsController_1.AdminListDocsController(useCase);
    return controller;
};
exports.makeAdminListDocsController = makeAdminListDocsController;
