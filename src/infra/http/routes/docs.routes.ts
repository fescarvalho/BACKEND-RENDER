import { Router } from "express";
import { uploadMiddleware } from "../middlewares/uploadMiddleware"; // O multer que criamos no passo 3
import { makeUploadController } from "../../../main/factories/makeUploadController";
import { authMiddleware } from "../middlewares/auth"; // Seu middleware de auth existente
import { makeListDocumentsController } from "../../../main/factories/makeListDocumentsController";
import { makeDeleteDocumentController } from "../../../main/factories/makeDeleteDocumentController";
const router = Router();

// Instancia o controller através da fábrica
const uploadController = makeUploadController();
const listController = makeListDocumentsController();
const deleteController = makeDeleteDocumentController();
router.post(
  "/upload",
  authMiddleware,           // 1. Protege a rota
  uploadMiddleware.single("arquivo"), // 2. Processa o arquivo (Multer)
  (req, res) => uploadController.handle(req, res) // 3. Executa a Clean Architecture
);

router.get(
  "/meus-documentos",
  authMiddleware as any, // Protegida por login
  (req, res) => listController.handle(req, res)
);
router.delete(
  "/documentos/:id",
  authMiddleware as any,
  (req, res) => deleteController.handle(req, res)
);
export default router;