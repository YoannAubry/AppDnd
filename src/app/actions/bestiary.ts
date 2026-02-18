"use server"

import { prisma } from "@/lib/prisma" // Notre nouveau client
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generateSlug, getNumber, getString, parseJsonList } from "@/lib/actions-utils"

// --- CRÉATION ---
export async function createMonsterAction(formData: FormData) {
  const name = getString(formData, "name")
  
  // Construction de l'objet pour Prisma
  const data = {
    name,
    slug: generateSlug(name),
    type: getString(formData, "type"),
    hp: getString(formData, "hp"),
    ac: getNumber(formData, "ac"),
    speed: getString(formData, "speed"),
    challenge: getString(formData, "challenge"),
    senses: getString(formData, "senses"),
    languages: getString(formData, "languages"),
    
    // JSON Stringify pour SQLite
    attributes: JSON.stringify({
      str: getNumber(formData, "str", 10),
      dex: getNumber(formData, "dex", 10),
      con: getNumber(formData, "con", 10),
      int: getNumber(formData, "int", 10),
      wis: getNumber(formData, "wis", 10),
      cha: getNumber(formData, "cha", 10)
    }),
    
    traits: JSON.stringify(parseJsonList(formData.get("traits"))),
    actions: JSON.stringify(parseJsonList(formData.get("actions"))),
    
    // Image: on ne gère pas l'upload ici pour l'instant (null par défaut)
    image: null 
  }

  try {
    await prisma.monster.create({ data })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le monstre")
  }

  revalidatePath("/bestiary")
  redirect(`/bestiary/${data.slug}`)
}

// --- MISE À JOUR ---
export async function updateMonsterAction(id: string, formData: FormData) {
  // ... Même logique de récupération ...
  const name = getString(formData, "name")
  
  const data = {
    name,
    type: getString(formData, "type"),
    hp: getString(formData, "hp"),
    ac: getNumber(formData, "ac"),
    speed: getString(formData, "speed"),
    challenge: getString(formData, "challenge"),
    senses: getString(formData, "senses"),
    languages: getString(formData, "languages"),
    attributes: JSON.stringify({
      str: getNumber(formData, "str", 10),
      // ... autres stats
      dex: getNumber(formData, "dex", 10),
      con: getNumber(formData, "con", 10),
      int: getNumber(formData, "int", 10),
      wis: getNumber(formData, "wis", 10),
      cha: getNumber(formData, "cha", 10)
    }),
    traits: JSON.stringify(parseJsonList(formData.get("traits"))),
    actions: JSON.stringify(parseJsonList(formData.get("actions")))
  }

  try {
    await prisma.monster.update({
      where: { id }, // Prisma utilise 'id', pas '_id' (sauf si mappé)
      data
    })
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/bestiary")
  redirect("/bestiary")
}

// --- SUPPRESSION ---
export async function deleteMonsterAction(id: string) {
  try {
    await prisma.monster.delete({
      where: { id }
    })
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Impossible de supprimer")
  }
  revalidatePath("/bestiary")
  redirect("/bestiary")
}