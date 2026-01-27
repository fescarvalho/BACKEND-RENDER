import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Atualizamos a interface para o TypeScript não reclamar
export interface AuthRequest extends Request {
  userId?: number;
  usuario_id?: number;
  tipo_usuario?: string; // ✅ ADICIONADO AQUI
  usuario_email?: string;
}

// Interface do Payload do Token (o que está gravado dentro do JWT)
interface TokenPayload {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.JWT_SECRET || 'segredo_padrao_teste';
    
    // 2. Tipamos o retorno do verify para saber o que tem dentro
    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    // 3. Injetamos os dados no Request
    req.userId = decoded.id;
    req.usuario_id = decoded.id;
    req.tipo_usuario = decoded.tipo_usuario; // ✅ ADICIONADO AQUI
    req.usuario_email = decoded.email;
    
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token inválido" });
  }
};