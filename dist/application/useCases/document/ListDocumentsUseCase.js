"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDocumentsUseCase = void 0;
class ListDocumentsUseCase {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    async execute(params) {
        return await this.documentRepository.findAll(params);
    }
}
exports.ListDocumentsUseCase = ListDocumentsUseCase;
