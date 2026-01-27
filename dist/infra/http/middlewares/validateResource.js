"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        // Use parseAsync para garantir validações assíncronas se houver
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            console.log("ERRO DE VALIDAÇÃO ZOD:", JSON.stringify(e, null, 2));
            return res.status(400).json({
                msg: "Dados inválidos",
                // 🔥 CORREÇÃO: Enviamos 'e.errors' direto (sem map) 
                // para o frontend ter acesso ao array 'path' original.
                errors: e.issues,
            });
        }
        return res.status(400).json({ msg: "Erro inesperado na validação" });
    }
};
exports.validate = validate;
