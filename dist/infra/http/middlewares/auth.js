"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: "Acesso negado!" });
    try {
        const secret = process.env.JWT_SECRET || 'segredo_padrao_teste';
        // 2. Tipamos o retorno do verify para saber o que tem dentro
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // 3. Injetamos os dados no Request
        req.userId = decoded.id;
        req.usuario_id = decoded.id;
        req.tipo_usuario = decoded.tipo_usuario; // ✅ ADICIONADO AQUI
        req.usuario_email = decoded.email;
        next();
    }
    catch (error) {
        return res.status(403).json({ msg: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
