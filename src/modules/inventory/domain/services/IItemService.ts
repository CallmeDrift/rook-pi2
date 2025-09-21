// src/inventory/domain/services/IItemService.ts
import { Item } from "../models/Item";

export interface IItemService {
  // Obtener todos los items de un usuario específico
  getAllItemsByUsername(username: string): Promise<Item[]>;

  // Obtener un item específico de un usuario
  getItemById(username: string, itemId: string): Promise<Item | null>;

  // Obtener todos los items de un usuario (alternativa)
  getItemsByUsername(username: string): Promise<Item[]>;
}
