import { Request, Response } from "express";
import { prisma } from "../../databases/prisma/client";

export class GetNotificationsController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const notifications = await prisma.notifications.findMany({
        where: { user_id: Number(userId) },
        orderBy: { criado_em: 'desc' },
        take: 20 // Limita as últimas 20
      });

      return res.json(notifications);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao buscar notificações" });
    }
  }
}