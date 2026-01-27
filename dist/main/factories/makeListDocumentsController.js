"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeListDocumentsController = void 0;
const PrismaDocumentRepository_1 = require("../../infra/databases/repositories/PrismaDocumentRepository");
const ListDocumentsUseCase_1 = require("../../application/useCases/document/ListDocumentsUseCase");
const ListDocumentsController_1 = require("../../infra/http/controllers/ListDocumentsController");
const makeListDocumentsController = () => {
    const documentRepository = new PrismaDocumentRepository_1.PrismaDocumentRepository();
    const listDocumentsUseCase = new ListDocumentsUseCase_1.ListDocumentsUseCase(documentRepository);
    const listDocumentsController = new ListDocumentsController_1.ListDocumentsController(listDocumentsUseCase);
    return listDocumentsController;
};
exports.makeListDocumentsController = makeListDocumentsController;
