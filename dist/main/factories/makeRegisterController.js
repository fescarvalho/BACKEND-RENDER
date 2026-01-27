"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRegisterController = void 0;
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository");
const RegisterUseCase_1 = require("../../application/useCases/auth/RegisterUseCase");
const LoginUseCase_1 = require("../../application/useCases/auth/LoginUseCase"); // Precisamos satisfazer o construtor
const AuthController_1 = require("../../infra/http/controllers/AuthController");
const makeRegisterController = () => {
    const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
    // Instanciamos os UseCases
    const loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository);
    const registerUseCase = new RegisterUseCase_1.RegisterUseCase(userRepository);
    // Injetamos ambos no Controller
    const authController = new AuthController_1.AuthController(loginUseCase, registerUseCase);
    return authController;
};
exports.makeRegisterController = makeRegisterController;
