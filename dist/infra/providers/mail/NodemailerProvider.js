"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodemailerProvider {
    constructor() {
        // Configuração EXATA do seu arquivo antigo
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_API_KEY
            }
        });
    }
    async sendMail(to, subject, body) {
        const REMETENTE_OFICIAL = `"Leandro Abreu Contabilidade" <${process.env.GOOGLE_EMAIL}>`;
        try {
            await this.transporter.sendMail({
                from: REMETENTE_OFICIAL,
                to,
                subject,
                html: body,
            });
            console.log(`✅ E-mail enviado para ${to}`);
        }
        catch (error) {
            console.error("❌ Erro ao enviar e-mail:", error);
            // Na Clean Architecture, podemos lançar o erro para o UseCase decidir o que fazer,
            // ou apenas logar se não for crítico.
        }
    }
}
exports.NodemailerProvider = NodemailerProvider;
