"use server"

import { writeClient } from "../../lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- CRÉATION ---
export async function createNPCAction(formData: FormData) {
  // 1. Récupération des champs simples
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const personality = formData.get("personality") as string
  const history = formData.get("history") as string
  
  // 2. Gestion du Combat
  const combatType = formData.get("combatType") as string
  const monsterTemplateId = formData.get("monsterTemplate") as string
  
  const hp = formData.get("hp") as string
  const ac = Number(formData.get("ac"))
  
  // 3. Parsing des listes JSON
  let inventory = [], spells = []
  try {
    const inv = formData.get("inventory") as string
    if(inv) inventory = JSON.parse(inv).filter((x:any) => x.name && x.name.trim() !== "")

    const spl = formData.get("spells") as string
    // Pour les sorts, si c'est juste un tableau de strings, adapte le filtre
    if(spl) spells = JSON.parse(spl) 
  } catch(e) { console.error("JSON Error", e) }

  try {
    // 4. Construction de l'objet
    const doc: any = {
      _type: "npc",
      name,
      role,
      personality,
      history,
      combatType,
      inventory, // Liste d'objets {name, desc}
      spells     // Liste de strings
    }

    // Ajout conditionnel des stats
    if (combatType === 'template' && monsterTemplateId) {
      doc.monsterTemplate = { _type: 'reference', _ref: monsterTemplateId }
    } else if (combatType === 'custom') {
      doc.customStats = { hp, ac }
    }

    // 5. Envoi à Sanity
    await writeClient.create(doc)
    console.log(`✅ PNJ créé : ${name}`)

  } catch (error) {
    console.error("Erreur création PNJ:", error)
    throw new Error("Impossible de créer le PNJ")
  }

  // 6. Redirection
  revalidatePath("/npcs")
  redirect("/npcs")
}

// --- SUPPRESSION ---
export async function deleteNPCAction(id: string) {
  try {
    await writeClient.delete(id)
    console.log(`🗑️ PNJ ${id} supprimé.`)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  
  revalidatePath("/npcs")
  redirect("/npcs")
}

// --- MISE À JOUR ---
export async function updateNPCAction(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const personality = formData.get("personality") as string
  const history = formData.get("history") as string
  
  const combatType = formData.get("combatType") as string
  const monsterTemplateId = formData.get("monsterTemplate") as string
  
  const hp = formData.get("hp") as string
  const ac = Number(formData.get("ac"))
  
  let inventory = [], spells = []
  try {
    const inv = formData.get("inventory") as string; if(inv) inventory = JSON.parse(inv).filter((x:any) => x.name);
    const spl = formData.get("spells") as string; if(spl) spells = JSON.parse(spl);
  } catch(e) {}

  try {
    // Préparation du patch
    const patch: any = {
      name, role, personality, history, combatType,
      inventory, spells
    }

    // Gestion propre des champs conditionnels (on efface ceux qu'on n'utilise plus)
    if (combatType === 'template') {
      patch.monsterTemplate = monsterTemplateId ? { _type: 'reference', _ref: monsterTemplateId } : undefined
      patch.customStats = undefined 
    } else if (combatType === 'custom') {
      patch.customStats = { hp, ac }
      patch.monsterTemplate = undefined
    } else {
      patch.monsterTemplate = undefined
      patch.customStats = undefined
    }

    await writeClient.patch(id).set(patch).commit()
    console.log(`✅ PNJ ${name} mis à jour.`)

  } catch (error) {
    console.error("Erreur update PNJ:", error)
    throw new Error("Impossible de modifier le PNJ")
  }

  revalidatePath("/npcs")
  revalidatePath(`/npcs/${id}`) // Rafraîchit la fiche détail
  redirect(`/npcs/${id}`)
}