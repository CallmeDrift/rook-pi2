import { Item } from "../models/Item";

export interface ItemRepository {
  // Buscar un item por ID de un usuario específico
  findById(nombreUsuario: string, itemId: string): Promise<Item | null>;

  // Obtener todos los items de un usuario específico
  findByUserId(nombreUsuario: string): Promise<Item[]>;

  // Actualizar disponibilidad de un item
  updateAvailability(id: string, isAvailable: boolean): Promise<Item>;

  // Actualizar cualquier campo de un item
  updateItem(id: string, data: Partial<Item>): Promise<Item>;
  // Transferir item entre usuarios
  transferItem(originUser: string, targetUser: string, itemName: string): Promise<string>;
}
