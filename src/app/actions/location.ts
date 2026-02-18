"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getString, parseJsonList } from "@/lib/actions-utils"

function parseIds(json: string) {
  const ids = parseJsonList(json) as string[]
  return ids.map(id => ({ id }))
}

// --- CRÉATION ---
export async function createLocationAction(formData: FormData) {
  const name = getString(formData, "name")
  const description = getString(formData, "description")
  
  // AJOUT ICI 👇
  const image = getString(formData, "image")

  const npcIds = parseIds(getString(formData, "npcs"))
  const monsterIds = parseIds(getString(formData, "monsters"))

  try {
    await prisma.location.create({
      data: {
        name,
        // On sauvegarde l'URL de l'image si elle existe
        image: image || null,
        description: JSON.stringify([{ children: [{ text: description }] }]), 
        npcs: { connect: npcIds },
        monsters: { connect: monsterIds }
      }
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le lieu")
  }

  revalidatePath("/locations")
  redirect("/locations")
}

// --- UPDATE ---
export async function updateLocationAction(id: string, formData: FormData) {
  const name = getString(formData, "name")
  const description = getString(formData, "description")
  
  // AJOUT ICI 👇
  const image = getString(formData, "image")

  const npcIds = parseIds(getString(formData, "npcs"))
  const monsterIds = parseIds(getString(formData, "monsters"))

  try {
    await prisma.location.update({
      where: { id },
      data: {
        name,
        // On met à jour l'image SEULEMENT si une nouvelle URL est envoyée
        // (Si le champ est vide mais qu'on veut garder l'ancienne, il faut gérer ça dans le form ou ici)
        // Ici, on suppose que le form renvoie l'URL existante si pas changée.
        image: image || undefined, 
        
        description: JSON.stringify([{ children: [{ text: description }] }]),
        npcs: { set: npcIds },
        monsters: { set: monsterIds }
      }
    })
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/locations")
  revalidatePath(`/locations/${id}`)
  redirect(`/locations/${id}`)
}

export async function deleteLocationAction(id: string) {
  try {
    await prisma.location.delete({ where: { id } })
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  revalidatePath("/locations")
  redirect("/locations")
}