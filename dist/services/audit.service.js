"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = void 0;
const prisma_1 = require("../lib/prisma");
/**
 * Registra uma ação importante no sistema para auditoria (LGPD)
 */
const createAuditLog = async (userId, acao, detalhes, documentId) => {
    try {
        await prisma_1.prisma.auditLog.create({
            data: {
                user_id: userId, // ✅ Nome corrigido para bater com o schema
                acao: acao,
                detalhes: detalhes,
                document_id: documentId // ✅ Seguindo o padrão snake_case do seu banco
            }
        });
        console.log(`[AUDIT] Ação registrada: ${acao} para user ${userId}`);
    }
    catch (error) {
        // Falha no log não deve derrubar a aplicação principal
        console.error("Erro crítico ao gravar log de auditoria:", error);
    }
};
exports.createAuditLog = createAuditLog;
