"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientsUseCase = void 0;
class ListClientsUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(search) {
        // Aqui você poderia remover a senha do retorno, se o repository já não fizesse isso
        return await this.userRepository.findAll(search);
    }
}
exports.ListClientsUseCase = ListClientsUseCase;
