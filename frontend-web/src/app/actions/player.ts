"use server"

import { writeClient } from "@/lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- CREATE ---
export async function createPlayerAction(formData: FormData) {
  const name = formData.get("name") as string
  const playerName = formData.get("playerName") as string
  const race = formData.get("race") as string
  const classe = formData.get("class") as string // 'class' est un mot réservé
  const level = Number(formData.get("level"))
  
  const hpMax = Number(formData.get("hpMax"))
  const ac = Number(formData.get("ac"))
  const initBonus = Number(formData.get("initBonus"))

  try {
    await writeClient.create({
      _type: "player",
      name, playerName, race, class: classe, level,
      hpMax, ac, initBonus
    })
    console.log(`✅ Joueur créé : ${name}`)
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le joueur")
  }

  revalidatePath("/players")
  redirect("/players")
}

// --- UPDATE ---
export async function updatePlayerAction(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const playerName = formData.get("playerName") as string
  const race = formData.get("race") as string
  const classe = formData.get("class") as string
  const level = Number(formData.get("level"))
  
  const hpMax = Number(formData.get("hpMax"))
  const ac = Number(formData.get("ac"))
  const initBonus = Number(formData.get("initBonus"))

  try {
    await writeClient.patch(id).set({
      name, playerName, race, class: classe, level,
      hpMax, ac, initBonus
    }).commit()
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
  await writeClient.delete(id)
  revalidatePath("/players")
  redirect("/players")
}