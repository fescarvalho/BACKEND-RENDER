"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardStatsUseCase = void 0;
class GetDashboardStatsUseCase {
    constructor(userRepository, documentRepository) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
    }
    async execute({ userId, userType }) {
        // Se for ADMIN: Vê estatísticas GERAIS
        if (userType === "admin") {
            const totalClients = await this.userRepository.count();
            const totalDocuments = await this.documentRepository.count();
            const totalStorage = await this.documentRepository.sumTotalSize();
            return {
                role: "admin",
                cards: {
                    clientes: totalClients,
                    documentos: totalDocuments,
                    storage_bytes: totalStorage,
                },
            };
        }
        // Se for CLIENTE: Vê apenas as SUAS estatísticas
        const myDocuments = await this.documentRepository.count(userId);
        const myStorage = await this.documentRepository.sumTotalSize(userId);
        return {
            role: "cliente",
            cards: {
                documentos: myDocuments,
                storage_bytes: myStorage,
            },
        };
    }
}
exports.GetDashboardStatsUseCase = GetDashboardStatsUseCase;
