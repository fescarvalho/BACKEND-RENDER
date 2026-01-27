"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ token, newPassword }) {
        const secret = process.env.JWT_SECRET || "segredo_padrao";
        try {
            // 1. Valida o Token
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded.type !== "reset") {
                throw new Error("Token inválido.");
            }
            // 2. Criptografa a nova senha
            const salt = await bcryptjs_1.default.genSalt(8);
            const senhaHash = await bcryptjs_1.default.hash(newPassword, salt);
            // 3. Atualiza no Banco
            await this.userRepository.update(decoded.id, {
                senha_hash: senhaHash
            });
        }
        catch (error) {
            throw new Error("Link inválido ou expirado.");
        }
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
