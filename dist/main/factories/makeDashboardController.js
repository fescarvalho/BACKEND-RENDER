"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDashboardController = void 0;
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository");
const PrismaDocumentRepository_1 = require("../../infra/databases/repositories/PrismaDocumentRepository");
const GetDashboardStatsUseCase_1 = require("../../application/useCases/admin/GetDashboardStatsUseCase");
const DashboardController_1 = require("../../infra/http/controllers/DashboardController");
const makeDashboardController = () => {
    // Instancia os dois repositórios necessários
    const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const documentRepository = new PrismaDocumentRepository_1.PrismaDocumentRepository();
    const useCase = new GetDashboardStatsUseCase_1.GetDashboardStatsUseCase(userRepository, documentRepository);
    const controller = new DashboardController_1.DashboardController(useCase);
    return controller;
};
exports.makeDashboardController = makeDashboardController;
