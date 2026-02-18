// --- TYPES DE BASE ---
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface Slug {
  current: string;
}

export interface ImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

// --- ENTITÉS ---

export interface Monster extends SanityDocument {
  _type: 'monster';
  name: string;
  slug: Slug;
  image?: ImageAsset;
  type: string; // ex: "Dragon"
  stats: StatBlock;
}

export interface NPC extends SanityDocument {
  _type: 'npc';
  name: string;
  role?: string;
  image?: ImageAsset;
  personality?: string;
  history?: string;
  faction?: Faction;
  
  // Gestion Combat
  combatType: 'none' | 'template' | 'custom';
  monsterTemplate?: Monster;
  customStats?: StatBlock;
  
  inventory?: InventoryItem[];
  spells?: string[]; // Liste de noms
}

export interface Player extends SanityDocument {
  _type: 'player';
  name: string;
  playerName: string;
  avatar?: ImageAsset;
  race: string;
  class: string;
  level: number;
  
  // Stats vitales
  hpMax: number;
  ac: number;
  initBonus: number;
}

export interface Location extends SanityDocument {
  _type: 'location';
  name: string;
  image?: ImageAsset;
  description?: any[]; // Portable Text
  npcs?: NPC[];
  monsters?: Monster[];
}

export interface Campaign extends SanityDocument {
  _type: 'campaign';
  title: string;
  slug: Slug;
  level: string;
  image?: ImageAsset;
  synopsis: string;
  acts?: Act[];
}

// --- SOUS-TYPES ---

export interface StatBlock {
  ac: number;
  hp: string;
  speed: string;
  challenge?: string;
  senses?: string;
  languages?: string;
  attributes: Attributes;
  traits?: Ability[];
  actions?: Ability[];
}

export interface Attributes {
  str: number; dex: number; con: number;
  int: number; wis: number; cha: number;
}

export interface Ability {
  name: string;
  desc: string;
}

export interface Faction {
  name: string;
  description?: string;
  image?: ImageAsset;
}

export interface Act {
  _key: string;
  title: string;
  summary: string;
  locations?: Location[];
}

export interface InventoryItem {
  name: string;
  desc: string;
}