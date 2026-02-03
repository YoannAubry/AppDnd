const { createClient } = require('@sanity/client')
const fs = require('fs')

// --- TA CONFIG ---
const client = createClient({
  projectId: '5hbzc0ty',
  dataset: 'production',
  apiVersion: '2026-02-02',
  useCdn: false,
  token: 'skS0jK3I2JXQ9uvT5zGajEZVHFGaeTJRlpYVTiwCVRlGeK5Y21CDBXXxUiofjUydlByqOPl0GZjvypNOoKsOy3tknBteC3Ueon1r7djpnVA8yotmzuEckO5uFS9CS0oRsMs1RHIViXWa6kWrxkSWVIY409clJaqsDA2d1woHuDyws646gDaj' // Remets ton token sk...
})

// Chargement du JSON
const rawData = fs.readFileSync('./full_import.json', 'utf8')
const items = JSON.parse(rawData)

async function importCampaign() {
  console.log("🔍 Résolution des liens Monstres...")
  
  // 1. Récupérer tous les monstres existants pour avoir leurs vrais ID
  const existingMonsters = await client.fetch('*[_type == "monster"]{_id, name}')
  
  // 2. Créer une map Nom -> ID
  const monsterMap = {}
  existingMonsters.forEach(m => monsterMap[m.name.toLowerCase()] = m._id)

  console.log(`📚 ${existingMonsters.length} monstres trouvés en base.`)

  // 3. Préparer la transaction
  const transaction = client.transaction()

  items.forEach(doc => {
    // Si c'est un document qui fait référence à un monstre (NPC ou Location)
    // On doit remplacer la ref "monstre_..." par le vrai ID
    
    // Cas PNJ avec template
    if (doc.monsterTemplate && doc.monsterTemplate._ref.startsWith('monstre_')) {
        const monsterName = doc.monsterTemplate._ref.replace('monstre_', '').toLowerCase()
        // On essaie de trouver l'ID
        const realId = Object.keys(monsterMap).find(k => k.includes(monsterName)) 
        // (Recherche floue : si 'zombie' est dans 'zombie puant', ça matche)
        
        if (realId) {
            doc.monsterTemplate._ref = monsterMap[realId]
        } else {
            console.warn(`⚠️ Monstre non trouvé pour ${doc.name} : ${monsterName}`)
            delete doc.monsterTemplate // On retire le lien cassé
        }
    }

    // Cas Lieu avec liste de monstres
    if (doc.monsters) {
        doc.monsters.forEach(refObj => {
            if (refObj._ref.startsWith('monstre_')) {
                const monsterName = refObj._ref.replace('monstre_', '').toLowerCase()
                const realId = Object.keys(monsterMap).find(k => k.includes(monsterName))
                if (realId) refObj._ref = monsterMap[realId]
            }
        })
    }

    // On crée l'objet (createOrReplace pour éviter les erreurs si on relance)
    if (doc._id) {
      transaction.createOrReplace(doc)
    } else {
      transaction.create(doc)
    }
  })

  console.log("🚀 Envoi vers Sanity...")
  
  try {
    await transaction.commit()
    console.log("✅ Campagne importée avec succès !")
  } catch (err) {
    console.error("❌ Erreur :", err.message)
  }
}

importCampaign()