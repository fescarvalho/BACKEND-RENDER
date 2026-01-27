import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IMailProvider } from "../../../domain/providers/IMailProvider";
import { gerarHtmlTemplate } from "../../../infra/providers/mail/MailTemplate"; 

export class SendForgotPasswordMailUseCase {
  constructor(
    private userRepository: IUserRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return; 

    
    const secret = process.env.JWT_SECRET || "segredo";
    const token = jwt.sign({ id: user.id, type: "reset" }, secret, { expiresIn: "1h" });

    
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    
    const corpoMensagem = `
      <h2 style="color: #333; font-size: 22px; margin-top: 0;">Recuperação de Senha</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo para criar uma nova senha.
      </p>
      <p style="color: #999; font-size: 14px; margin-top: 20px;">
        Se não foi você, pode ignorar este e-mail com segurança.
      </p>
    `;

    
    const htmlFinal = gerarHtmlTemplate(
      "Redefinir Senha",
      corpoMensagem,
      link,
      "REDEFINIR MINHA SENHA"
    );

    
    await this.mailProvider.sendMail(user.email, "Redefinição de Senha", htmlFinal);
  }
}