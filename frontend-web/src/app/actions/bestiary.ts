"use server"

import { writeClient } from "@/lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generateSlug, getNumber, getString, parseJsonList } from "@/lib/actions-utils"

// --- CRÉATION ---
export async function createMonsterAction(formData: FormData) {
  const name = getString(formData, "name")
  const type = getString(formData, "type")
  
  const hp = getString(formData, "hp")
  const ac = getNumber(formData, "ac")
  const speed = getString(formData, "speed")
  const challenge = getString(formData, "challenge")
  const senses = getString(formData, "senses")
  const languages = getString(formData, "languages")

  const str = getNumber(formData, "str", 10)
  const dex = getNumber(formData, "dex", 10)
  const con = getNumber(formData, "con", 10)
  const int = getNumber(formData, "int", 10)
  const wis = getNumber(formData, "wis", 10)
  const cha = getNumber(formData, "cha", 10)

  // Parsing propre
  const traits = parseJsonList(formData.get("traits"))
  const actions = parseJsonList(formData.get("actions"))

  const slug = generateSlug(name)

  try {
    await writeClient.create({
      _type: "monster",
      name,
      slug: { _type: 'slug', current: slug },
      type,
      stats: {
        hp, ac, speed, challenge, senses, languages,
        attributes: { str, dex, con, int, wis, cha },
        traits, actions
      }
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le monstre")
  }

  revalidatePath("/bestiary")
  redirect(`/bestiary/${slug}`)
}

// --- MISE À JOUR ---
export async function updateMonsterAction(id: string, formData: FormData) {
  const name = getString(formData, "name")
  const type = getString(formData, "type")
  
  const hp = getString(formData, "hp")
  const ac = getNumber(formData, "ac")
  const speed = getString(formData, "speed")
  const challenge = getString(formData, "challenge")
  const senses = getString(formData, "senses")
  const languages = getString(formData, "languages")

  const str = getNumber(formData, "str", 10)
  const dex = getNumber(formData, "dex", 10)
  const con = getNumber(formData, "con", 10)
  const int = getNumber(formData, "int", 10)
  const wis = getNumber(formData, "wis", 10)
  const cha = getNumber(formData, "cha", 10)

  const traits = parseJsonList(formData.get("traits"))
  const actions = parseJsonList(formData.get("actions"))

  try {
    await writeClient.patch(id).set({
      name, type,
      stats: {
        hp, ac, speed, challenge, senses, languages,
        attributes: { str, dex, con, int, wis, cha },
        traits, actions
      }
    }).commit()
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/bestiary")
  redirect("/bestiary") // Redirection vers la liste car on n'a pas forcément le slug
}

// --- SUPPRESSION ---
export async function deleteMonsterAction(id: string) {
  try {
    await writeClient.delete(id)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Impossible de supprimer")
  }
  revalidatePath("/bestiary")
  redirect("/bestiary")
}