import { Request, Response } from "express";
import { SendForgotPasswordMailUseCase } from "../../../application/useCases/auth/SendForgotPasswordMailUseCase";
import { ResetPasswordUseCase } from "../../../application/useCases/auth/ResetPasswordUseCase";

export class PasswordRecoveryController {
  constructor(
    private sendForgotUseCase: SendForgotPasswordMailUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  async forgot(req: Request, res: Response) {
    const { email } = req.body;
    // Não usamos await ou try/catch obstrutivo aqui para não travar a request no envio de email,
    // mas se quiser garantir o envio, use await.
    await this.sendForgotUseCase.execute(email);
    
    return res.json({ msg: "Se o e-mail existir, você receberá um link." });
  }

  async reset(req: Request, res: Response) {
    const { token, senha } = req.body;

    try {
      await this.resetPasswordUseCase.execute({ token, newPassword: senha });
      return res.json({ msg: "Senha atualizada com sucesso!" });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }
}