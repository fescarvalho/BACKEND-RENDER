"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        // 1. Verifica se e-mail já existe
        const userExists = await this.userRepository.findByEmail(data.email);
        if (userExists) {
            throw new Error("Este e-mail já está em uso.");
        }
        // 2. Criptografa a senha
        const salt = await bcryptjs_1.default.genSalt(8);
        const senhaHash = await bcryptjs_1.default.hash(data.senha, salt);
        // 3. Cria o usuário
        const newUser = await this.userRepository.create({
            nome: data.nome,
            email: data.email,
            senha_hash: senhaHash, // Salva o hash!
            cpf: data.cpf,
            telefone: data.telefone,
            tipo_usuario: "cliente", // Padrão
        });
        // Remove a senha do retorno para segurança
        const { senha_hash, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
}
exports.RegisterUseCase = RegisterUseCase;
