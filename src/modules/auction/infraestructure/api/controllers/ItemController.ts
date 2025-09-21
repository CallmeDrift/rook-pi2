// src/interfaces/http/controllers/ItemController.ts
import { Request, Response } from "express";
import { IItemService } from "../../../../inventory/domain/services/IItemService";

export class ItemController {
  constructor(private readonly itemService: IItemService) {}

  // Helper para normalizar username
  private getUsername(req: Request): string | undefined {
    const usernameParam = req.params["username"];
    const usernameQuery = req.query["username"];

    if (typeof usernameParam === "string") return usernameParam.trim();
    if (typeof usernameQuery === "string") return usernameQuery.trim();

    return undefined;
  }

  // Obtener un item por id y username
  getItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const username = this.getUsername(req);
      const itemId = req.params["id"];

      if (!username) return res.status(400).json({ error: "username no proporcionado" });
      if (!itemId) return res.status(400).json({ error: "id no proporcionado" });

      const item = await this.itemService.getItemById(username, itemId);
      if (!item) return res.status(404).json({ error: "Item not found" });

      return res.json(item);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  // Listar items por username
  listItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const username = this.getUsername(req);
      if (!username) return res.status(400).json({ error: "username no proporcionado" });

      const items = await this.itemService.getItemsByUsername(username);
      return res.json(items);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
}
