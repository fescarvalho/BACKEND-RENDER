"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware"); // O multer que criamos no passo 3
const makeUploadController_1 = require("../../../main/factories/makeUploadController");
const auth_1 = require("../middlewares/auth"); // Seu middleware de auth existente
const makeListDocumentsController_1 = require("../../../main/factories/makeListDocumentsController");
const makeDeleteDocumentController_1 = require("../../../main/factories/makeDeleteDocumentController");
const router = (0, express_1.Router)();
// Instancia o controller através da fábrica
const uploadController = (0, makeUploadController_1.makeUploadController)();
const listController = (0, makeListDocumentsController_1.makeListDocumentsController)();
const deleteController = (0, makeDeleteDocumentController_1.makeDeleteDocumentController)();
router.post("/upload", auth_1.authMiddleware, // 1. Protege a rota
uploadMiddleware_1.uploadMiddleware.single("arquivo"), // 2. Processa o arquivo (Multer)
(req, res) => uploadController.handle(req, res) // 3. Executa a Clean Architecture
);
router.get("/meus-documentos", auth_1.authMiddleware, // Protegida por login
(req, res) => listController.handle(req, res));
router.delete("/documentos/:id", auth_1.authMiddleware, (req, res) => deleteController.handle(req, res));
exports.default = router;
