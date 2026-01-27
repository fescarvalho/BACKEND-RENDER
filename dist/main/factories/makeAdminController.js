"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdminController = void 0;
const PrismaUserRepository_1 = require("../../infra/databases/repositories/PrismaUserRepository");
const ListClientsUseCase_1 = require("../../application/useCases/admin/ListClientsUseCase");
const DeleteClientUseCase_1 = require("../../application/useCases/admin/DeleteClientUseCase");
const AdminController_1 = require("../../infra/http/controllers/AdminController");
const makeAdminController = () => {
    const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const listClientsUseCase = new ListClientsUseCase_1.ListClientsUseCase(userRepository);
    const deleteClientUseCase = new DeleteClientUseCase_1.DeleteClientUseCase(userRepository);
    const adminController = new AdminController_1.AdminController(listClientsUseCase, deleteClientUseCase);
    return adminController;
};
exports.makeAdminController = makeAdminController;
