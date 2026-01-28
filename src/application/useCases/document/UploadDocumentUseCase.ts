import { IStorageProvider } from "../../../domain/providers/IStorageProvider";
import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository"; 
import { IMailProvider } from "../../../domain/providers/IMailProvider";
import { gerarHtmlTemplate } from "../../../infra/providers/mail/MailTemplate";
import { PrismaAuditRepository } from "../../../infra/databases/repositories/PrismaAuditRepository"; 


interface UploadDocumentRequest {
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
  officeId: number; 
  userId: number;  
  titulo?: string; 
  vencimento?: string;
}

export class UploadDocumentUseCase {
  constructor(
    private storageProvider: IStorageProvider,
    private documentRepository: IDocumentRepository,
    private userRepository: IUserRepository,
    private mailProvider: IMailProvider,
    private auditRepository: PrismaAuditRepository
  ) {}

  async execute({ file, officeId, userId, titulo, vencimento }: UploadDocumentRequest) {

    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    
   
    const path = `${String(officeId)}/${String(userId)}/${timestamp}-${sanitizedName}`;

    const publicUrl = await this.storageProvider.save(
      file.buffer,
      path,
      file.mimetype
    );


    const document = await this.documentRepository.create({
      
      titulo: titulo || file.originalname.split(".")[0],
      url: publicUrl,
      tamanho_bytes: file.size,
      formato: file.mimetype,
      cliente_id: officeId,
      // criado_por: userId, 
      data_vencimento: vencimento ? new Date(vencimento) : null,
    });

    const cliente = await this.userRepository.findById(officeId);

    if (cliente && cliente.email) {
       const linkPlataforma = "https://leandro-abreu-contabilidade.vercel.app/login"; 
       const tituloDoc = titulo || file.originalname; 

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

      const htmlFinal = gerarHtmlTemplate(
        `Novo Documento: ${tituloDoc}`, 
        corpoMensagem, 
        linkPlataforma, 
        "ACESSAR MEUS DOCUMENTOS"
      );

      this.mailProvider.sendMail(cliente.email, `📄 Novo Documento: ${tituloDoc}`, htmlFinal)
        .catch(err => console.error("Erro ao enviar email de notificação", err));
    }
    await this.auditRepository.create({
      user_id: userId, 
      acao: "UPLOAD",
      detalhes: `Enviou arquivo "${file.originalname}" para o cliente ID ${officeId}`
    });
    return document;
  }
}