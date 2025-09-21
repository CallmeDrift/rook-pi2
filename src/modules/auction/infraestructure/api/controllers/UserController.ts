import { Request, Response } from "express";
import { IUserService } from "../../../../user/domain/services/IUserService";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  // Obtener usuario por id
  getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const idParam = req.params["id"];
      if (!idParam) return res.status(400).json({ error: "User ID is required" });

      const id = idParam.toString();
      const user = await this.userService.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Obtener usuario actual (por token)
  getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "No token provided" });

      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ error: "No token provided" });

      const user = await this.userService.findByToken(token);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Actualizar créditos de usuario por username
  updateCreditos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const username = req.params["nombreUsuario"];
      if (!username) return res.status(400).json({ error: "Nombre de usuario no proporcionado" });

      const { creditos } = req.body;
      if (creditos === undefined) return res.status(400).json({ error: "Créditos no proporcionados" });

      const user = await this.userService.updateCredits(username, Number(creditos));
      if (!user) return res.status(404).json({ error: "Usuario no encontrado o no se pudo actualizar" });

      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
}
