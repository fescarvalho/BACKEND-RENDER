import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

interface Request {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ token, newPassword }: Request) {
    const secret = process.env.JWT_SECRET || "segredo_padrao";

    try {
      
      const decoded: any = jwt.verify(token, secret);
      
      if (decoded.type !== "reset") {
        throw new Error("Token inválido.");
      }

      
      const salt = await bcrypt.genSalt(8);
      const senhaHash = await bcrypt.hash(newPassword, salt);

      
      await this.userRepository.update(decoded.id, {
        senha_hash: senhaHash
      });

    } catch (error) {
      throw new Error("Link inválido ou expirado.");
    }
  }
}