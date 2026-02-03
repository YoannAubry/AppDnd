// src/types/index.ts

// --- BESTIAIRE ---
export interface Monster {
	_id: string;
	name: string;
	slug: { current: string };
	image?: any;
	type: string;
	stats: {
	  ac: number;
	  hp: string;
	  speed: string;
	  challenge: string;
	  attributes: {
	    str: number; dex: number; con: number;
	    int: number; wis: number; cha: number;
	  };
	  senses?: string;
	  languages?: string;
	  traits?: { name: string; desc: string }[];
	  actions?: { name: string; desc: string }[];
	};
      }
      
      // --- PNJ ---
      export interface NPC {
	_id: string;
	name: string;
	role?: string;
	faction?: { name: string };
	image?: any;
	description?: string;
      }
      
      // --- LIEUX ---
      export interface Location {
	_id: string;
	name: string;
	description: any[]; // Rich text Sanity
	image?: any;
	npcs?: NPC[];
	monsters?: Monster[];
      }
      
      // --- CAMPAGNES ---
      export interface Act {
	_key: string;
	title: string;
	summary: string;
	locations?: Location[];
      }
      
      export interface Campaign {
	_id: string;
	title: string;
	slug: { current: string };
	level: string;
	image?: any;
	synopsis: string;
	acts?: Act[];
      }
