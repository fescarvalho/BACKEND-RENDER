"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRecoveryController = void 0;
class PasswordRecoveryController {
    constructor(sendForgotUseCase, resetPasswordUseCase) {
        this.sendForgotUseCase = sendForgotUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
    }
    async forgot(req, res) {
        const { email } = req.body;
        // Não usamos await ou try/catch obstrutivo aqui para não travar a request no envio de email,
        // mas se quiser garantir o envio, use await.
        await this.sendForgotUseCase.execute(email);
        return res.json({ msg: "Se o e-mail existir, você receberá um link." });
    }
    async reset(req, res) {
        const { token, senha } = req.body;
        try {
            await this.resetPasswordUseCase.execute({ token, newPassword: senha });
            return res.json({ msg: "Senha atualizada com sucesso!" });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }
}
exports.PasswordRecoveryController = PasswordRecoveryController;
