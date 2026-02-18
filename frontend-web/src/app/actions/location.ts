"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getString, parseJsonList } from "@/lib/actions-utils"

// Helper pour parser les listes d'IDs
function parseIds(json: string) {
  const ids = parseJsonList(json) as string[] // ["id1", "id2"]
  return ids.map(id => ({ id })) // [{id: "id1"}, {id: "id2"}]
}

// --- CRÉATION ---
export async function createLocationAction(formData: FormData) {
  const name = getString(formData, "name")
  const description = getString(formData, "description")
  
  // Note: On stocke la description en string simple maintenant pour SQLite (plus de PortableText complexe ici pour simplifier)
  // Ou on l'enrobe en JSON si on veut garder la structure block, mais restons simple : string brute.
  
  const npcIds = parseIds(getString(formData, "npcs"))
  const monsterIds = parseIds(getString(formData, "monsters"))

  try {
    await prisma.location.create({
      data: {
        name,
        description: JSON.stringify([{ children: [{ text: description }] }]), // Hack compatible PortableText basique
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

  const npcIds = parseIds(getString(formData, "npcs"))
  const monsterIds = parseIds(getString(formData, "monsters"))

  try {
    // Pour update des relations Many-to-Many en Prisma, on fait souvent 'set' pour remplacer la liste
    await prisma.location.update({
      where: { id },
      data: {
        name,
        description: JSON.stringify([{ children: [{ text: description }] }]),
        npcs: { set: npcIds },      // Remplace toute la liste
        monsters: { set: monsterIds } // Remplace toute la liste
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

// --- DELETE ---
export async function deleteLocationAction(id: string) {
  await prisma.location.delete({ where: { id } })
  revalidatePath("/locations")
  redirect("/locations")
}