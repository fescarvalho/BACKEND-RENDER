import nodemailer from "nodemailer";
import { IMailProvider } from "../../../domain/providers/IMailProvider";

export class NodemailerProvider implements IMailProvider {
  private transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL, 
        pass: process.env.GOOGLE_API_KEY 
      }
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    const REMETENTE_OFICIAL = `"Leandro Abreu Contabilidade" <${process.env.GOOGLE_EMAIL}>`;

    try {
      await this.transporter.sendMail({
        from: REMETENTE_OFICIAL,
        to,
        subject,
        html: body,
      });
      console.log(`✅ E-mail enviado para ${to}`);
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
      
      
    }
  }
}