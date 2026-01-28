import { Router } from "express";
import { makeLoginController } from "../../../main/factories/makeLoginController";
import { makeRegisterController } from "../../../main/factories/makeRegisterController"; // Importe a nova factory
import { validate } from "../middlewares/validateResource";
import { loginSchema, registerSchema } from "../schemas/authSchemas"; // Certifique-se que o registerSchema está aqui
import { makePasswordRecoveryController } from "../../../main/factories/makePasswordRecoveryController";
import { GetNotificationsController } from "../controllers/GetNotificationsController";


const router = Router();

// Controladores
const loginController = makeLoginController();
const registerController = makeRegisterController(); // Instância com o RegisterUseCase
const recoveryController = makePasswordRecoveryController();
const getNotifications = new GetNotificationsController();

const verifyAdmin = (req: any, res: any, next: any) => {
  if (req.tipo_usuario !== "admin") {
    return res.status(403).json({ msg: "Acesso restrito a administradores." });
  }
  next();
};

// Rota de Login
router.post(
  "/login",
  validate(loginSchema),
  (req, res) => loginController.login(req, res)
);

// ✅ Rota de Registro
router.post(
  "/register",
  validate(registerSchema), // Validação Zod
  (req, res) => registerController.register(req, res)
);

router.post("/forgot-password", (req, res) => recoveryController.forgot(req, res));
router.post("/reset-password", (req, res) => recoveryController.reset(req, res));
router.get("/notifications/:userId", (req, res) => getNotifications.handle(req, res));
export default router;