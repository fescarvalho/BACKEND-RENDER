"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendForgotPasswordMailUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MailTemplate_1 = require("../../../infra/providers/mail/MailTemplate"); // ✅ Importa o template
class SendForgotPasswordMailUseCase {
    constructor(userRepository, mailProvider) {
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
    }
    async execute(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            return;
        // Gera o token
        const secret = process.env.JWT_SECRET || "segredo";
        const token = jsonwebtoken_1.default.sign({ id: user.id, type: "reset" }, secret, { expiresIn: "1h" });
        // Link do Frontend
        const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        // ✅ Cria o corpo específico deste e-mail
        const corpoMensagem = `
      <h2 style="color: #333; font-size: 22px; margin-top: 0;">Recuperação de Senha</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo para criar uma nova senha.
      </p>
      <p style="color: #999; font-size: 14px; margin-top: 20px;">
        Se não foi você, pode ignorar este e-mail com segurança.
      </p>
    `;
        // ✅ Gera o HTML completo usando seu template bonito
        const htmlFinal = (0, MailTemplate_1.gerarHtmlTemplate)("Redefinir Senha", corpoMensagem, link, "REDEFINIR MINHA SENHA");
        // Envia usando o Provider
        await this.mailProvider.sendMail(user.email, "Redefinição de Senha", htmlFinal);
    }
}
exports.SendForgotPasswordMailUseCase = SendForgotPasswordMailUseCase;
