// src/types/index.ts

// --- TYPES PRISMA (Miroir de ton schema.prisma) ---

export interface Monster {
  id: string
  slug: string
  name: string
  type: string
  image?: string | null
  
  ac: number
  hp: string
  speed: string
  challenge?: string | null
  
  senses?: string | null
  languages?: string | null
  alignment?: string | null

  // Dans le code, on manipule ces champs parsés, pas les string JSON
  attributes: Attributes
  traits: Ability[]
  actions: Ability[]
}

export interface NPC {
  id: string
  name: string
  role?: string | null
  image?: string | null
  personality?: string | null
  history?: string | null

  inventory: InventoryItem[]
  spells: string[] // Liste simple de noms
  
  combatType: string // "none" | "template" | "custom"
  customStats?: StatBlock | null
  monsterTemplate?: Monster | null
  monsterId?: string | null
}

export interface Player {
  id: string
  name: string
  playerName?: string | null
  avatar?: string | null
  race?: string | null
  class?: string | null
  level: number
  
  hpMax: number
  ac: number
  initBonus: number
}

export interface Location {
  id: string
  name: string
  image?: string | null
  description?: string | null // Texte brut ou JSON PortableText stringifié
  
  npcs?: NPC[]
  monsters?: Monster[]
  
  // Champs calculés (pour les listes)
  npcCount?: number
  monsterCount?: number
}

export interface Campaign {
  id: string
  slug: string
  title: string
  level?: string | null
  image?: string | null
  synopsis?: string | null
  acts: Act[]
}

export interface Act {
  id: string
  _key?: string // Pour dnd-kit si besoin
  title: string
  summary?: string | null
  locations: Location[]
}

// --- TYPES UI / UTILITAIRES ---

export interface Attributes {
  str: number; dex: number; con: number;
  int: number; wis: number; cha: number;
}

export interface Ability {
  name: string;
  desc: string;
}

export interface StatBlock {
  hp: string | number; // Accepte les deux pour la flexibilité
  ac: number;
  speed?: string;
  attributes?: Attributes;
}

export interface InventoryItem {
  name: string;
  desc?: string;
}

// Pour le Tracker
export interface Combatant {
  id: string        // ID unique du combat (uuid aléatoire)
  sourceId?: string // ID Prisma (monstre/pnj/joueur d'origine)
  name: string
  type: 'player' | 'monster' | 'npc'
  faction: 'friendly' | 'hostile' | 'neutral'
  initiative: number
  hp: number
  hpMax: number
  ac: number
  conditions: string[]
  image?: string | null
}