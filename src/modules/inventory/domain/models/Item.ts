// inventory/domain/models/Item.ts

export const ITEM_TYPES = [
  "Héroes",
  "Armas",
  "Armaduras",
  "Ítems",
  "Habilidades especiales",
  "Épicas",
  "UNKNOWN"
] as const;
export type ItemType = typeof ITEM_TYPES[number];

export const HERO_TYPES = [
  'TANK',
  'WEAPONS_PAL',
  'FIRE_MAGE',
  'ICE_MAGE',
  'POISON_ROGUE',
  'SHAMAN',
  'MEDIC',
  'MACHETE',
  'UNKNOWN'
] as const;
export type HeroType = typeof HERO_TYPES[number];

export interface Item {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: ItemType;
  /** Para ítems específicos de un héroe. Requerido si type === "Héroes". */
  heroType?: HeroType;
  /** Si está en subasta => false (no usable); si no, true. */
  isAvailable: boolean;
  imagen:string
}

