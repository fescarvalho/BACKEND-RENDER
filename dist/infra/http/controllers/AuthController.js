"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    // Agora recebemos DOIS useCases. Marque como 'public' ou 'private' para o TS criar a propriedade
    constructor(loginUseCase, registerUseCase // Opcional por enquanto para não quebrar a factory de login
    ) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
    }
    async login(req, res) {
        /* ... (código do login mantém igual) ... */
        const { email, senha } = req.body;
        try {
            const result = await this.loginUseCase.execute({ email, senha });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ msg: error.message || "Erro na autenticação" });
        }
    }
    // ✅ NOVO MÉTODO
    async register(req, res) {
        if (!this.registerUseCase) {
            return res.status(500).json({ msg: "RegisterUseCase não injetado." });
        }
        try {
            const result = await this.registerUseCase.execute(req.body);
            return res.status(201).json({ msg: "Usuário cadastrado!", user: result });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message || "Erro no cadastro" });
        }
    }
}
exports.AuthController = AuthController;
