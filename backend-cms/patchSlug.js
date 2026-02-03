const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '5hbzc0ty',
  dataset: 'production',
  apiVersion: '2026-02-02',
  useCdn: false,
  token: 'skS0jK3I2JXQ9uvT5zGajEZVHFGaeTJRlpYVTiwCVRlGeK5Y21CDBXXxUiofjUydlByqOPl0GZjvypNOoKsOy3tknBteC3Ueon1r7djpnVA8yotmzuEckO5uFS9CS0oRsMs1RHIViXWa6kWrxkSWVIY409clJaqsDA2d1woHuDyws646gDaj' // REMETS TON TOKEN ICI
})

async function patchSlugs() {
  console.log("🔍 Recherche des monstres sans slug...")
  
  // On cherche tous les monstres qui n'ont pas de slug défini
  const monsters = await client.fetch('*[_type == "monster" && !defined(slug.current)]')
  
  console.log(`Trouvé ${monsters.length} monstres à réparer.`)

  const transaction = client.transaction()

  monsters.forEach(m => {
    // On génère un slug simple (minuscules, tirets)
    const newSlug = m.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    transaction.patch(m._id, p => p.set({
      slug: { _type: 'slug', current: newSlug }
    }))
    console.log(`Patch: ${m.name} -> ${newSlug}`)
  })

  try {
    await transaction.commit()
    console.log("✅ Tous les slugs ont été générés !")
  } catch (err) {
    console.error("❌ Erreur:", err.message)
  }
}

patchSlugs()