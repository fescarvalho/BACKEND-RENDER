"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteClientUseCase = void 0;
class DeleteClientUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        // Futuramente: Aqui chamaríamos o DeleteDocumentUseCase para apagar 
        // os arquivos do R2 antes de deletar o usuário do banco.
        await this.userRepository.delete(id);
    }
}
exports.DeleteClientUseCase = DeleteClientUseCase;
