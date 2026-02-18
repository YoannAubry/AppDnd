import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

function generateSlug(name: string): string {
  if (!name) return ""
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const prisma = new PrismaClient()

function parseTextToList(text: string) {
  if (!text || text === '-') return []
  const lines = text.split(/\n- |^- /g).filter(line => line.trim().length > 0)
  return lines.map(line => {
    const separatorMatch = line.match(/^([^.:]+)[.:]\s*(.*)/s)
    if (separatorMatch) {
      return { name: separatorMatch[1].trim(), desc: separatorMatch[2].trim() }
    } else {
      return { name: "Autre", desc: line.trim() }
    }
  })
}

async function main() {
  const filePath = path.join(process.cwd(), 'bestiaire.xlsx')
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ Fichier 'bestiaire.xlsx' introuvable à la racine !")
    process.exit(1)
  }

  // --- 1. PURGE ---
  console.log("🔥 Suppression de tous les monstres existants...")
  await prisma.monster.deleteMany()
  console.log("✅ Base monstres vidée.")

  // --- 2. LECTURE ---
  console.log("📖 Lecture du fichier Excel...")
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows: any[] = XLSX.utils.sheet_to_json(sheet)
  
  console.log(`📦 ${rows.length} monstres trouvés. Import en cours...`)

  let count = 0

  // --- 3. IMPORT ---
  for (const row of rows) {
    const name = row['Nom']
    if (!name) continue

    const slug = generateSlug(name)
    
    // Attributs
    const attributes = {
      str: Number(row['FOR']) || 10,
      dex: Number(row['DEX']) || 10,
      con: Number(row['CON']) || 10,
      int: Number(row['INT']) || 10,
      wis: Number(row['SAG']) || 10,
      cha: Number(row['CHA']) || 10
    }

    // Traits
    let traitsList = parseTextToList(row['Spécificités ']) // Avec espace
    if (!traitsList.length && row['Spécificités']) traitsList = parseTextToList(row['Spécificités']) // Sans espace

    if (row['Compétences et Jets de sauvegarde']) {
      traitsList.unshift({ name: "Compétences & JS", desc: row['Compétences et Jets de sauvegarde'] })
    }

    // Actions
    let actionsList = parseTextToList(row['Actions'])
    if (row['Réactions'] && row['Réactions'] !== '-') {
      actionsList.push(...parseTextToList(row['Réactions']).map(a => ({...a, name: `(Réaction) ${a.name}`})))
    }
    if (row['Actions légendaires'] && row['Actions légendaires'] !== '-') {
      actionsList.push(...parseTextToList(row['Actions légendaires']).map(a => ({...a, name: `(Légendaire) ${a.name}`})))
    }

    // Gestion XP et Taille
    const xp = row['XP'] ? ` (${row['XP']} XP)` : "";
    const taille = row['Taille'] ? ` (${row['Taille']})` : "";
    
    // Ajout taille au type
    let typeFinal = row['Type'] || 'Inconnu';
    if (taille && !typeFinal.includes('(')) {
        typeFinal += taille;
    }

    // Gestion des doublons de slug
    let finalSlug = slug
    let counter = 1
    // On vérifie si le slug existe déjà
    while (await prisma.monster.findUnique({ where: { slug: finalSlug } })) {
      counter++
      finalSlug = `${slug}-${counter}`
    }

    // Création
    await prisma.monster.create({
      data: {
        name: name,
        slug: finalSlug,
        type: typeFinal,
        challenge: String(row['Dangerosité'] || "0") + xp,
        ac: Number(row['CA']) || 10,
        hp: String(row['PV'] || "10"),
        speed: String(row['Vitesse'] || "9m"),
        alignment: row['Alignement'],
        senses: null, 
        languages: row['Langues'],
        
        attributes: JSON.stringify(attributes),
        traits: JSON.stringify(traitsList),
        actions: JSON.stringify(actionsList),
        
        image: null
      }
    })

    process.stdout.write(".")
    count++
  }

  console.log(`\n\n✅ Terminé ! ${count} monstres importés.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })