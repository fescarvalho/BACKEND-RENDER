"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// ✅ Importe as rotas da NOVA estrutura (Infra)
const auth_routes_1 = __importDefault(require("../infra/http/routes/auth.routes"));
const docs_routes_1 = __importDefault(require("../infra/http/routes/docs.routes"));
const admin_routes_1 = __importDefault(require("../infra/http/routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
BigInt.prototype.toJSON = function () {
    return Number(this);
};
// Configurações básicas
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Registra as rotas
// (Note que o prefixo /api é uma boa prática)
app.use("/auth", auth_routes_1.default); // /auth/login, /auth/register
app.use("/api", docs_routes_1.default); // /api/upload, /api/meus-documentos
app.use("/admin", admin_routes_1.default); // /admin/clientes, /admin/dashboard
// Rota de teste
app.get("/", (req, res) => {
    return res.json({ msg: "API Contabilidade (Clean Arch) - Online 🚀" });
});
// Inicialização
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
    console.log(`📁 Estrutura: Clean Architecture`);
});
