"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = void 0;
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository");
const LoginUseCase_1 = require("../../application/useCases/auth/LoginUseCase");
const AuthController_1 = require("../../infra/http/controllers/AuthController");
const makeLoginController = () => {
    const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository);
    const authController = new AuthController_1.AuthController(loginUseCase);
    return authController;
};
exports.makeLoginController = makeLoginController;
