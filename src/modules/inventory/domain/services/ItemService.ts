// src/inventory/domain/services/ItemService.ts
import { ItemRepository } from "../repositories/ItemRepository";
import { Item } from "../models/Item";
import { IItemService } from "./IItemService";

export class ItemService implements IItemService {
  constructor(private readonly itemRepo: ItemRepository) {}

  // Ya no existe un findAll general, hay que obtener items por usuario
  async getAllItemsByUsername(username: string): Promise<Item[]> {
    return this.itemRepo.findByUserId(username);
  }

  // Ahora se requiere username y itemId
  async getItemById(username: string, itemId: string): Promise<Item | null> {
    return this.itemRepo.findById(username, itemId);
  }

  // Método consistente para obtener todos los items de un usuario
  async getItemsByUsername(username: string): Promise<Item[]> {
    return this.itemRepo.findByUserId(username);
  }
}
