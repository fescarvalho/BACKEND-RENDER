import { IDocumentRepository, ListDocumentsDTO } from "../../../domain/repositories/IDocumentRepository";

export class ListDocumentsUseCase {
  constructor(private documentRepository: IDocumentRepository) {}

  async execute(params: ListDocumentsDTO) {
    return await this.documentRepository.findAll(params);
  }
}