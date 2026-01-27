"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocumentUseCase = void 0;
const MailTemplate_1 = require("../../../infra/providers/mail/MailTemplate");
class UploadDocumentUseCase {
    constructor(storageProvider, documentRepository, userRepository, mailProvider) {
        this.storageProvider = storageProvider;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
    }
    async execute({ file, officeId, userId, vencimento }) {
        // 1. Regra de Negócio: Definir o caminho/nome do arquivo
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/\s+/g, "_");
        const path = `${officeId}/${userId}/${timestamp}-${sanitizedName}`;
        // 2. Executa o Upload no Storage (R2)
        const publicUrl = await this.storageProvider.save(file.buffer, path, file.mimetype);
        // ✅ 3. Salva os metadados no Banco de Dados (ESTAVA FALTANDO ISSO)
        const document = await this.documentRepository.create({
            titulo: file.originalname.split(".")[0],
            url: publicUrl,
            tamanho_bytes: file.size,
            formato: file.mimetype,
            cliente_id: Number(officeId),
            data_vencimento: vencimento ? new Date(vencimento) : null,
        });
        // 4. Envia Notificação por E-mail
        // Buscamos o cliente para saber o nome e o e-mail dele
        const cliente = await this.userRepository.findById(Number(officeId));
        if (cliente && cliente.email) {
            const linkPlataforma = "https://leandro-abreu-contabilidade.vercel.app/login";
            const tituloDoc = file.originalname;
            const corpoMensagem = `
        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Olá, ${cliente.nome}!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Um novo documento importante foi adicionado à sua área segura.
        </p>
        
        <div style="background-color: #fff8e1; border-left: 4px solid #C5A059; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; color: #8a6d3b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Documento Disponível</p>
          <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: 600;">
            📄 ${tituloDoc}
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
            📅 Enviado em: ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      `;
            const htmlFinal = (0, MailTemplate_1.gerarHtmlTemplate)(`Novo Documento: ${tituloDoc}`, corpoMensagem, linkPlataforma, "ACESSAR MEUS DOCUMENTOS");
            // Enviamos o e-mail sem travar (fire-and-forget)
            this.mailProvider.sendMail(cliente.email, `📄 Novo Documento: ${tituloDoc}`, htmlFinal)
                .catch(err => console.error("Erro ao enviar email de notificação", err));
        }
        return document;
    }
}
exports.UploadDocumentUseCase = UploadDocumentUseCase;
