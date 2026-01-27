"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ email, senha }) {
        // 1. Verificar se usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("E-mail ou senha incorretos.");
        }
        // 2. Verificar a senha (Hash)
        // O banco pode ter salvo como 'senha_hash' ou 'senha'. Ajuste conforme seu schema.
        const isPasswordValid = await bcryptjs_1.default.compare(senha, user.senha_hash || user.senha);
        if (!isPasswordValid) {
            throw new Error("E-mail ou senha incorretos.");
        }
        // 3. Gerar Token JWT
        const secret = process.env.JWT_SECRET || "segredo_padrao_teste";
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario,
        }, secret, { expiresIn: "1d" } // Token expira em 1 dia
        );
        // 4. Retornar dados (sem mandar a senha de volta!)
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.tipo_usuario,
            },
            token,
        };
    }
}
exports.LoginUseCase = LoginUseCase;
