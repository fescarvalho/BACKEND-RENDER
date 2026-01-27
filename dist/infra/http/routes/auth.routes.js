"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const makeLoginController_1 = require("../../../main/factories/makeLoginController");
const makeRegisterController_1 = require("../../../main/factories/makeRegisterController"); // Importe a nova factory
const validateResource_1 = require("../middlewares/validateResource");
const authSchemas_1 = require("../schemas/authSchemas"); // Certifique-se que o registerSchema está aqui
const makePasswordRecoveryController_1 = require("../../../main/factories/makePasswordRecoveryController");
const makeAdminListDocsController_1 = require("../../../main/factories/makeAdminListDocsController"); // ✅ Importe a factory
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Controladores
const loginController = (0, makeLoginController_1.makeLoginController)();
const registerController = (0, makeRegisterController_1.makeRegisterController)(); // Instância com o RegisterUseCase
const recoveryController = (0, makePasswordRecoveryController_1.makePasswordRecoveryController)();
const adminListDocsController = (0, makeAdminListDocsController_1.makeAdminListDocsController)(); //
const verifyAdmin = (req, res, next) => {
    if (req.tipo_usuario !== "admin") {
        return res.status(403).json({ msg: "Acesso restrito a administradores." });
    }
    next();
};
// Rota de Login
router.post("/login", (0, validateResource_1.validate)(authSchemas_1.loginSchema), (req, res) => loginController.login(req, res));
// ✅ Rota de Registro
router.post("/register", (0, validateResource_1.validate)(authSchemas_1.registerSchema), // Validação Zod
(req, res) => registerController.register(req, res));
router.post("/forgot-password", (req, res) => recoveryController.forgot(req, res));
router.post("/reset-password", (req, res) => recoveryController.reset(req, res));
router.get("/clientes/:id/documentos", auth_1.authMiddleware, verifyAdmin, (req, res) => adminListDocsController.handle(req, res));
exports.default = router;
