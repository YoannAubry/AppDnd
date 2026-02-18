"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getNumber, getString } from "@/lib/actions-utils"

// --- CREATE ---
export async function createPlayerAction(formData: FormData) {
  try {
    await prisma.player.create({
      data: {
        name: getString(formData, "name"),
        playerName: getString(formData, "playerName"),
        race: getString(formData, "race"),
        class: getString(formData, "class"),
        level: getNumber(formData, "level", 1),
        hpMax: getNumber(formData, "hpMax", 10),
        ac: getNumber(formData, "ac", 10),
        initBonus: getNumber(formData, "initBonus", 0)
      }
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le joueur")
  }

  revalidatePath("/players")
  redirect("/players")
}

// --- UPDATE ---
export async function updatePlayerAction(id: string, formData: FormData) {
  try {
    await prisma.player.update({
      where: { id },
      data: {
        name: getString(formData, "name"),
        playerName: getString(formData, "playerName"),
        race: getString(formData, "race"),
        class: getString(formData, "class"),
        level: getNumber(formData, "level"),
        hpMax: getNumber(formData, "hpMax"),
        ac: getNumber(formData, "ac"),
        initBonus: getNumber(formData, "initBonus")
      }
    })
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/players")
  revalidatePath(`/players/${id}`)
  redirect(`/players/${id}`)
}

// --- DELETE ---
export async function deletePlayerAction(id: string) {
  await prisma.player.delete({ where: { id } })
  revalidatePath("/players")
  redirect("/players")
}