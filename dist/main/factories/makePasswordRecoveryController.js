"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePasswordRecoveryController = void 0;
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository");
const NodemailerProvider_1 = require("../../infra/providers/mail/NodemailerProvider");
const SendForgotPasswordMailUseCase_1 = require("../../application/useCases/auth/SendForgotPasswordMailUseCase");
const ResetPasswordUseCase_1 = require("../../application/useCases/auth/ResetPasswordUseCase");
const PasswordRecoveryController_1 = require("../../infra/http/controllers/PasswordRecoveryController");
const makePasswordRecoveryController = () => {
    const userRepo = new PrismaUserRepository_1.PrismaUserRepository();
    const mailProvider = new NodemailerProvider_1.NodemailerProvider();
    const sendForgot = new SendForgotPasswordMailUseCase_1.SendForgotPasswordMailUseCase(userRepo, mailProvider);
    const resetPass = new ResetPasswordUseCase_1.ResetPasswordUseCase(userRepo);
    return new PasswordRecoveryController_1.PasswordRecoveryController(sendForgot, resetPass);
};
exports.makePasswordRecoveryController = makePasswordRecoveryController;
