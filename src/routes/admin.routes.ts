import { Router } from "express";
import { verificarToken } from "../middlewares/auth";
import { makeAdminController } from "../main/factories/makeAdminController";
import { makeDashboardController } from "../main/factories/makeDashboardController";
import { makeAdminListDocsController } from "../main/factories/makeAdminListDocsController"; 
import { makeGetAuditLogsController } from "../main/factories/makeGetAuditLogsController";
import { makeDeleteUserController } from "../main/factories/makeDeleteUserController";

const router = Router();
const adminController = makeAdminController();
const dashboardController = makeDashboardController();
const adminListDocsController = makeAdminListDocsController(); 
const auditLogsController = makeGetAuditLogsController();
const deleteUserController = makeDeleteUserController();

const verifyAdmin = (req: any, res: any, next: any) => {
  if (req.tipo_usuario !== "admin") {
    return res.status(403).json({ msg: "Acesso restrito a administradores." });
  }
  next();
};


router.get(
  "/clientes",
  verificarToken as any,
  verifyAdmin,
  (req, res) => adminController.list(req, res)
);


router.get(
  "/clientes/buscar",
  verificarToken as any,
  verifyAdmin,
  (req, res) => adminController.list(req, res)
);
router.put(
  "/users/:id", 
  verificarToken as any, 
  verifyAdmin, 
  (req, res) => adminController.update(req, res)
);

router.delete(
  "/users/:id", 
  verificarToken as any,
  verifyAdmin,
  (req, res) => deleteUserController.handle(req, res) 
);


router.get(
  "/dashboard",
  verificarToken as any,
  (req, res) => dashboardController.handle(req, res)
);
router.get(
  "/clientes/:id/documentos",
  verificarToken as any,
  verifyAdmin,
  (req, res) => adminListDocsController.handle(req, res)
);
router.get(
  "/audit-logs",
  verificarToken as any,
  verifyAdmin,
  (req, res) => auditLogsController.handle(req, res)
);



export default router;