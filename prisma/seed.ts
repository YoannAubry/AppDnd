import { PrismaClient } from '@prisma/client'
import { createClient } from '@sanity/client'

const prisma = new PrismaClient()

// --- CONFIG SANITY ---
const sanity = createClient({
  projectId: '5hbzc0ty', 
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-02',
})

// Helper pour les images
const getImageUrl = (image: any) => {
  if (!image?.asset?._ref) return null
  const ref = image.asset._ref
  const [file, id, size, ext] = ref.split('-')
  return `https://cdn.sanity.io/images/5hbzc0ty/production/${id}-${size}.${ext}`
}

async function main() {
  console.log('🔥 Purge de la base SQLite...')
  // On vide tout (l'ordre compte peu avec deleteMany mais c'est mieux)
  await prisma.act.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.location.deleteMany()
  await prisma.nPC.deleteMany()
  await prisma.monster.deleteMany()
  await prisma.player.deleteMany()

  console.log('🚀 Démarrage de l\'import...')

  // 1. MONSTRES
  const monsters = await sanity.fetch(`*[_type == "monster"]`)
  for (const m of monsters) {
    await prisma.monster.create({
      data: {
        id: m._id,
        slug: m.slug?.current || m.name.toLowerCase().replace(/\s+/g, '-'),
        name: m.name,
        type: m.type || 'Inconnu',
        image: getImageUrl(m.image),
        ac: m.stats?.ac || 10,
        hp: m.stats?.hp || "10",
        speed: m.stats?.speed || "9m",
        challenge: m.stats?.challenge,
        
        // --- JSON STRINGIFY POUR SQLITE ---
        attributes: JSON.stringify(m.stats?.attributes || {}),
        traits: JSON.stringify(m.stats?.traits || []),
        actions: JSON.stringify(m.stats?.actions || [])
      }
    })
  }
  console.log(`✅ ${monsters.length} monstres importés.`)

  // 2. JOUEURS
  const players = await sanity.fetch(`*[_type == "player"]`)
  for (const p of players) {
    await prisma.player.create({
      data: {
        id: p._id,
        name: p.name,
        playerName: p.playerName,
        avatar: getImageUrl(p.avatar),
        race: p.race,
        class: p.class,
        level: p.level || 1,
        hpMax: p.hpMax || 10,
        ac: p.ac || 10,
        initBonus: p.initBonus || 0
      }
    })
  }
  console.log(`✅ ${players.length} joueurs importés.`)

  // 3. PNJ
  const npcs = await sanity.fetch(`*[_type == "npc"]`)
  for (const n of npcs) {
    let monsterId = null
    if (n.monsterTemplate?._ref) {
      // On vérifie que le monstre lié existe bien
      const exists = await prisma.monster.findUnique({ where: { id: n.monsterTemplate._ref } })
      if (exists) monsterId = n.monsterTemplate._ref
    }

    await prisma.nPC.create({
      data: {
        id: n._id,
        name: n.name,
        role: n.role,
        image: getImageUrl(n.image),
        personality: n.personality,
        history: n.history,
        combatType: n.combatType || 'none',
        monsterId: monsterId,

        // --- JSON STRINGIFY POUR SQLITE ---
        inventory: JSON.stringify(n.inventory || []),
        spells: JSON.stringify(n.spells || []),
        customStats: JSON.stringify(n.customStats || {})
      }
    })
  }
  console.log(`✅ ${npcs.length} PNJ importés.`)

  // 4. LIEUX
  const locations = await sanity.fetch(`*[_type == "location"]`)
  for (const l of locations) {
    const npcConnections = l.npcs?.map((ref: any) => ({ id: ref._ref })).filter(Boolean) || []
    const monsterConnections = l.monsters?.map((ref: any) => ({ id: ref._ref })).filter(Boolean) || []

    await prisma.location.create({
      data: {
        id: l._id,
        name: l.name,
        image: getImageUrl(l.image),
        // Description : On stocke le PortableText brut en string
        description: JSON.stringify(l.description || []), 
        
        npcs: { connect: npcConnections }, // Prisma gère les relations, pas besoin de stringify ici
        monsters: { connect: monsterConnections }
      }
    }).catch((e: any) => console.warn(`⚠️ Erreur import lieu ${l.name}`))
  }
  console.log(`✅ ${locations.length} lieux importés.`)

  // 5. CAMPAGNES
  const campaigns = await sanity.fetch(`*[_type == "campaign"]`)
  for (const c of campaigns) {
    await prisma.campaign.create({
      data: {
        id: c._id,
        slug: c.slug?.current || c.title.toLowerCase().replace(/\s+/g, '-'),
        title: c.title,
        level: c.level,
        image: getImageUrl(c.image),
        synopsis: c.synopsis,
        
        acts: {
          create: c.acts?.map((a: any, i: number) => ({
            title: a.title,
            summary: a.summary,
            order: i,
            locations: {
              connect: a.locations?.map((ref: any) => ({ id: ref._ref })) || []
            }
          })) || []
        }
      }
    })
  }
  console.log(`✅ ${campaigns.length} campagnes importées.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
