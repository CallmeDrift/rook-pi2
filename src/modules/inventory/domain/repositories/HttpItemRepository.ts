import axios from "axios";
import { Item, ItemType, HeroType } from "../models/Item";
import { ItemRepository } from "../../domain/repositories/ItemRepository";

/**
 * Implementación HTTP de ItemRepository basada en usuario
 */
export class HttpItemRepository implements ItemRepository {
  constructor(private readonly baseUrl: string) {}

  // Buscar item por ID requiere username
  async findById(nombreUsuario: string, itemId: string): Promise<Item | null> {
    console.log("[HttpItemRepository] findById called:", { nombreUsuario, itemId });
    try {
      const items = await this.findByUserId(nombreUsuario);
      const found = items.find(i => i.id === itemId) || null;
      console.log("[HttpItemRepository] Item encontrado:", found);
      return found;
    } catch (err) {
      console.error("[HttpItemRepository] Error findById:", err);
      return null;
    }
  }

  // Obtener todos los items de un usuario
  async findByUserId(nombreUsuario: string): Promise<Item[]> {
    console.log("[HttpItemRepository] findByUserId called:", { nombreUsuario });
    try {
      const res = await axios.get(`${this.baseUrl}/usuarios/${nombreUsuario}`);
      console.log("[HttpItemRepository] Respuesta raw inventario:", res.data.inventario);

      const inventario = res.data.inventario;
      const allItems = [
        ...(inventario.weapons || []),
        ...(inventario.armors || []),
        ...(inventario.items || []),
        ...(inventario.epicAbility || []),
        ...(inventario.hero || []),
      ];
      console.log("[HttpItemRepository] allItems combined:", allItems);

      const mappedItems = allItems.map(item => this.mapToDomain(item, nombreUsuario));
      console.log("[HttpItemRepository] Mapped items:", mappedItems);

      return mappedItems;
    } catch (err) {
      console.error("[HttpItemRepository] Error findByUserId:", err);
      return [];
    }
  }

  // Actualizar item (usa la ruta correcta: PUT /items/modify/:id)
  async updateItem(id: string, data: Partial<Item>): Promise<Item> {
  console.log("[HttpItemRepository] updateItem called:", { id, data });

  // Validación estricta
  if (data.isAvailable === null || data.isAvailable === undefined) {
    throw new Error("isAvailable es requerido para actualizar un item");
  }

  try {
    const res = await axios.put<{ message: string; item?: any }>(
      `${this.baseUrl}/items/modify/${id}`,
      data
    );
    console.log("[HttpItemRepository] updateItem response:", res.data);

    if (!res.data.item) {
  return {
    id: id,
    userId: data.userId || "",
    name: data.name || "UNKNOWN",
    description: data.description || "",
    type: (data.type as ItemType) || "UNKNOWN",
    heroType: (data.heroType as HeroType) || "UNKNOWN",
    isAvailable: data.isAvailable, // seguro porque validaste arriba
    imagen: data.imagen || "",
  };
}

// ⚠️ validamos que el backend devuelva status
if (res.data.item.status === undefined || res.data.item.status === null) {
  throw new Error(`Item ${id} actualizado pero backend no devuelve status`);
}

return this.mapToDomain(res.data.item, data.userId || "");

  } catch (err) {
    console.error(`[updateItem] Error al actualizar item ${id}:`, err);
    throw err;
  }
}


  // Actualizar disponibilidad de item (esta sí existe como PATCH /items/:id/status)
  async updateAvailability(id: string, isAvailable: boolean): Promise<Item> {
  console.log("[HttpItemRepository] updateAvailability called:", { id, isAvailable });
  try {
    const res = await axios.patch<{ message: string; item: any }>(
      `${this.baseUrl}/items/${id}/status`,
      { status: isAvailable }
    );
    console.log("[HttpItemRepository] updateAvailability response:", res.data);
    
    // ⚠️ aquí el mapper ya va a validar que el backend envíe status
    return this.mapToDomain(res.data.item, res.data.item.userId || "");
  } catch (err) {
    console.error(`[updateAvailability] Error al actualizar disponibilidad ${id}:`, err);
    throw err;
  }
}


  // Nuevo método para transferir items entre usuarios
  async transferItem(originUser: string, targetUser: string, itemName: string): Promise<string> {
    console.log("[HttpItemRepository] transferItem called:", { originUser, targetUser, itemName });
    try {
      const res = await axios.patch<{ message: string }>(
        `${this.baseUrl}/usuarios/transfer-item`,
        { originUser, targetUser, itemName }
      );
      console.log("[HttpItemRepository] transferItem response:", res.data);
      return res.data.message; // el mensaje "Ítem X transferido..."
    } catch (err) {
      console.error(`[transferItem] Error al transferir ${itemName}:`, err);
      throw err;
    }
  }

  // Mapper actualizado para usar el username como userId
  private mapToDomain(item: any, ownerUsername: string): Item {
  if (item.status === undefined || item.status === null) {
    throw new Error(`Item ${item.id} no tiene status definido`);
  }

  return {
    id: item.id?.toString() || "",
    userId: ownerUsername, // usamos el username como userId
    name: item.name || "UNKNOWN",
    description: item.description || "",
    type: (item.type as ItemType) || "UNKNOWN",
    heroType: (item.heroType as HeroType) || "UNKNOWN",
    isAvailable: item.status, // siempre tomamos lo que venga
    imagen: item.image || "",
  };
}
}
