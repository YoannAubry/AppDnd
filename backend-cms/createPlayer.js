const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5hbzc0ty',
  dataset: 'production',
  apiVersion: '2026-02-02',
  useCdn: false,
  token: 'skS0jK3I2JXQ9uvT5zGajEZVHFGaeTJRlpYVTiwCVRlGeK5Y21CDBXXxUiofjUydlByqOPl0GZjvypNOoKsOy3tknBteC3Ueon1r7djpnVA8yotmzuEckO5uFS9CS0oRsMs1RHIViXWa6kWrxkSWVIY409clJaqsDA2d1woHuDyws646gDaj' // Remets ton token sk...
})

async function createFullPlayer() {
  console.log("🛠️ Création du Joueur...")

  // 1. D'abord, on crée les Objets de son inventaire (s'ils n'existent pas)
  const itemWarhammer = {
    _type: 'item',
    _id: 'item_warhammer', // ID fixe pour éviter doublon
    name: 'Marteau de Guerre',
    type: 'Arme',
    rarity: 'Commun',
    value: '15 po',
    description: [{_type: 'block', children: [{_type: 'span', text: '1d8 contondant (Polyvalent 1d10)'}]}]
  }

  const itemShield = {
    _type: 'item',
    _id: 'item_shield',
    name: 'Bouclier',
    type: 'Armure',
    rarity: 'Commun',
    value: '10 po',
    description: [{_type: 'block', children: [{_type: 'span', text: '+2 CA'}]}]
  }

  // 2. On crée le Joueur
  const player = {
    _type: 'player',
    name: 'Thorin Ecus-de-Chêne',
    playerName: 'Yoann',
    // Avatar: Idéalement, tu l'uploades à la main dans le studio, ou via script (complexe)
    
    // Classes & Race
    race: 'Nain des Collines',
    class: 'Clerc (Domaine de la Vie)',
    level: 3,

    // Stats Vitales
    hpMax: 27, // (8+3) + 2*(5+3) + 3 (Nain)
    ac: 18,    // Cotte de mailles (16) + Bouclier (2)
    pp: 13,    // Perception Passive (10 + 3 SAG)
    initBonus: -1, // DEX 8 (-1)
    spellSaveDC: 13, // 8 + 2 (Prof) + 3 (SAG)

    // Inventaire (Lien vers les objets créés plus haut)
    inventory: [
      { _type: 'reference', _ref: 'item_warhammer' },
      { _type: 'reference', _ref: 'item_shield' }
    ]
  }

  const transaction = client.transaction()
  
  // On crée les objets (createOrReplace)
  transaction.createOrReplace(itemWarhammer)
  transaction.createOrReplace(itemShield)
  
  // On crée le joueur (create simple car on veut pouvoir en créer plusieurs du même nom)
  transaction.create(player)

  try {
    const res = await transaction.commit()
    console.log("✅ Joueur créé avec succès !")
    console.log("ID du joueur :", res.results[2].document._id) // Le 3ème élément de la transaction
  } catch (err) {
    console.error("❌ Erreur :", err.message)
  }
}

createFullPlayer()