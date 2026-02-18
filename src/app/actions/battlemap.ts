"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getString } from "@/lib/actions-utils"

// --- CRÉATION ---
export async function createBattlemapAction(formData: FormData) {
  const name = getString(formData, "name")
  const image = getString(formData, "image")
  const locationId = getString(formData, "locationId") || null

  try {
    await prisma.battlemap.create({
      data: {
        name,
        image,
        locationId
      }
    })
  } catch (error) {
    console.error("Erreur création battlemap:", error)
    throw new Error("Impossible de créer la carte")
  }

  revalidatePath("/maps")
  redirect("/maps")
}

// --- SUPPRESSION ---
export async function deleteBattlemapAction(id: string) {
  try {
    await prisma.battlemap.delete({ where: { id } })
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Impossible de supprimer la carte")
  }
  
  revalidatePath("/maps")
  redirect("/maps")
}