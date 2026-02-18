"use server"
import { prisma } from "@/lib/prisma"

// Helper pour parser JSON en toute sécurité
const parse = (str: string | null) => str ? JSON.parse(str) : []
const parseObj = (str: string | null) => str ? JSON.parse(str) : {}

// --- MONSTRES ---

export async function getMonsters() {
  const monsters = await prisma.monster.findMany({ orderBy: { name: 'asc' } })
  return monsters.map((m: any) => formatMonster(m))
}

export async function getMonster(slug: string) {
  const m = await prisma.monster.findUnique({ where: { slug } })
  return m ? formatMonster(m) : null
}

// Fonction de formatage pour retrouver la structure "Sanity-like"
function formatMonster(m: any) {
  return {
    ...m,
    slug: { current: m.slug }, // Hack de compatibilité
    stats: {
      hp: m.hp,
      ac: m.ac,
      speed: m.speed,
      challenge: m.challenge,
      attributes: parseObj(m.attributes),
      traits: parse(m.traits),
      actions: parse(m.actions),
      senses: m.senses,
      languages: m.languages,
      alignment: m.alignment
    }
  }
}

// --- PNJ ---

export async function getNPCs() {
  const npcs = await prisma.nPC.findMany({ 
    orderBy: { name: 'asc' },
    // On peut inclure la faction si tu as un modèle Faction (pour l'instant c'est juste un champ texte ou manquant dans le seed)
  })
  return npcs // Pas besoin de formatage complexe pour la liste
}

export async function getNPC(id: string) {
  const n = await prisma.nPC.findUnique({
    where: { id },
    include: { monsterTemplate: true } // On récupère le template lié
  })
  if (!n) return null

  return {
    ...n,
    _id: n.id, // Compatibilité
    inventory: parse(n.inventory),
    spells: parse(n.spells),
    customStats: parseObj(n.customStats),
    // On formate le template s'il existe
    monsterTemplate: n.monsterTemplate ? formatMonster(n.monsterTemplate) : null
  }
}

// --- JOUEURS ---

export async function getPlayers() {
  const players = await prisma.player.findMany({ orderBy: { name: 'asc' } })
  return players.map((p: any) => ({ ...p, _id: p.id }))
}

export async function getPlayer(id: string) {
  const p = await prisma.player.findUnique({ where: { id } })
  return p ? { ...p, _id: p.id } : null
}

// --- LIEUX ---

export async function getLocations() {
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { npcs: true, monsters: true }
      }
    }
  })
  
  // Formatage pour la liste (npcCount)
  return locations.map((l: any) => ({
    ...l,
    _id: l.id,
    npcCount: l._count.npcs,
    monsterCount: l._count.monsters
  }))
}

export async function getLocation(id: string) {
  const l = await prisma.location.findUnique({
    where: { id },
    include: {
      npcs: true,
      monsters: true
    }
  })
  if (!l) return null

  return {
    ...l,
    _id: l.id,
    // Description est stockée en string JSON (PortableText)
    description: parse(l.description),
    npcs: l.npcs.map((n: any) => ({ ...n, _id: n.id })),
    monsters: l.monsters.map((m: any) => formatMonster(m))
  }
}

// --- CAMPAGNES ---

export async function getCampaigns() {
  return await prisma.campaign.findMany({ orderBy: { title: 'asc' } })
}

export async function getCampaign(slug: string) {
  const c = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      acts: {
        orderBy: { order: 'asc' },
        include: {
          locations: {
            include: {
              npcs: true,
              monsters: true
            }
          }
        }
      }
    }
  })
  if (!c) return null

  return {
    ...c,
    _id: c.id,
    slug: { current: c.slug },
    acts: c.acts.map((act: any) => ({
      ...act,
      _key: act.id,
      locations: act.locations.map((l: any) => ({
        ...l,
        _id: l.id,
        description: parse(l.description), // Pour l'affichage dans l'acte
        npcs: l.npcs.map((n: any) => ({ ...n, _id: n.id })),
        monsters: l.monsters.map((m: any) => formatMonster(m))
      }))
    }))
  }
}

// --- RECHERCHE GLOBALE (Pour le Tracker) ---

export async function searchEntities(query: string) {
  if (!query || query.length < 2) return []

  // Recherche parallèle
  const [monsters, npcs, players] = await Promise.all([
    prisma.monster.findMany({
      where: { name: { contains: query } }, // Case insensitive par défaut sur SQLite souvent, sinon mode: 'insensitive' sur Postgres
      take: 5
    }),
    prisma.nPC.findMany({
      where: { name: { contains: query } },
      take: 5,
      include: { monsterTemplate: true }
    }),
    prisma.player.findMany({
      where: { name: { contains: query } },
      take: 5
    })
  ])

  // Formatage unifié pour le tracker
  const results = [
  ...monsters.map((m: any) => ({ ...formatMonster(m), _type: 'monster', _id: m.id })),
  
  ...npcs.map((n: any) => ({
    ...n, _id: n.id, _type: 'npc',
    customStats: parseObj(n.customStats),
    monsterTemplate: n.monsterTemplate ? formatMonster(n.monsterTemplate) : null
  })),
  
  ...players.map((p: any) => ({ ...p, _id: p.id, _type: 'player' }))
]

  return results
}

// Récupère une entité par son ID pour le tracker
export async function getEntityById(id: string, type: 'monster' | 'npc' | 'player') {
  if (type === 'monster') {
    const m = await prisma.monster.findUnique({ where: { id } })
    return m ? { ...formatMonster(m), _type: 'monster' } : null
  }
  if (type === 'player') {
    const p = await prisma.player.findUnique({ where: { id } })
    return p ? { ...p, _type: 'player' } : null
  }
  if (type === 'npc') {
    return getNPC(id) // On réutilise la fonction existante qui inclut l'inventaire etc.
  }
  return null
}