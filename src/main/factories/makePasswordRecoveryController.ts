import { PrismaUserRepository } from "../../infra/databases/repositories/PrismaUserRepository";
import { NodemailerProvider } from "../../infra/providers/mail/NodemailerProvider";
import { SendForgotPasswordMailUseCase } from "../../application/useCases/auth/SendForgotPasswordMailUseCase";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase";
import { PasswordRecoveryController } from "../../infra/http/controllers/PasswordRecoveryController";

export const makePasswordRecoveryController = () => {
  const userRepo = new PrismaUserRepository();
  const mailProvider = new NodemailerProvider();

  const sendForgot = new SendForgotPasswordMailUseCase(userRepo, mailProvider);
  const resetPass = new ResetPasswordUseCase(userRepo);

  return new PasswordRecoveryController(sendForgot, resetPass);
};