import { Request, Response } from "express";
import { LoginUseCase } from "../../../application/useCases/auth/LoginUseCase";
import { RegisterUseCase } from "../../../application/useCases/auth/RegisterUseCase"; // Importe aqui

export class AuthController {
  // Agora recebemos DOIS useCases. Marque como 'public' ou 'private' para o TS criar a propriedade
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase?: RegisterUseCase // Opcional por enquanto para não quebrar a factory de login
  ) {}

  async login(req: Request, res: Response) {
    /* ... (código do login mantém igual) ... */
    const { email, senha } = req.body;
    try {
      const result = await this.loginUseCase.execute({ email, senha });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ msg: error.message || "Erro na autenticação" });
    }
  }

  // ✅ NOVO MÉTODO
  async register(req: Request, res: Response) {
    if (!this.registerUseCase) {
      return res.status(500).json({ msg: "RegisterUseCase não injetado." });
    }

    try {
      const result = await this.registerUseCase.execute(req.body);
      return res.status(201).json({ msg: "Usuário cadastrado!", user: result });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message || "Erro no cadastro" });
    }
  }
}