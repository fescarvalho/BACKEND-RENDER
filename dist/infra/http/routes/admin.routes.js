"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const makeAdminController_1 = require("../../../main/factories/makeAdminController");
const makeDashboardController_1 = require("../../../main/factories/makeDashboardController");
const router = (0, express_1.Router)();
const adminController = (0, makeAdminController_1.makeAdminController)();
const dashboardController = (0, makeDashboardController_1.makeDashboardController)();
// Middleware para garantir que é admin
// (Você pode criar um middleware 'adminOnly' separado depois se quiser)
const verifyAdmin = (req, res, next) => {
    if (req.tipo_usuario !== "admin") {
        return res.status(403).json({ msg: "Acesso restrito a administradores." });
    }
    next();
};
// Rota: Listar Clientes
router.get("/clientes", auth_1.authMiddleware, verifyAdmin, (req, res) => adminController.list(req, res));
// Rota: Busca (Opcional, pois a listagem já aceita query params, mas mantendo compatibilidade)
router.get("/clientes/buscar", auth_1.authMiddleware, verifyAdmin, (req, res) => adminController.list(req, res));
// Rota: Deletar Cliente
router.delete("/users/:id", auth_1.authMiddleware, verifyAdmin, (req, res) => adminController.delete(req, res));
router.get("/dashboard", auth_1.authMiddleware, (req, res) => dashboardController.handle(req, res));
exports.default = router;
