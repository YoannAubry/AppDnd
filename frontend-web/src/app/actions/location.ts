"use server"

import { writeClient } from "@/lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getString } from "@/lib/actions-utils"

function parseRefs(jsonString: string): any[] {
  try {
    if (!jsonString) return []
    const ids = JSON.parse(jsonString)
    if (!Array.isArray(ids)) return []
    return ids.map((id: string) => ({
      _key: id, // Important pour React et Sanity
      _type: 'reference',
      _ref: id
    }))
  } catch (e) {
    console.warn("Erreur parsing refs:", e)
    return []
  }
}

// --- CRÉATION ---
export async function createLocationAction(formData: FormData) {
  const name = getString(formData, "name")
  const descriptionText = getString(formData, "description")
  
  // Transformation Texte -> Bloc
  const description = descriptionText ? [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [{ _type: 'span', text: descriptionText }]
    }
  ] : []

  const npcs = parseRefs(getString(formData, "npcs"))
  const monsters = parseRefs(getString(formData, "monsters"))

  try {
    await writeClient.create({
      _type: "location",
      name,
      description,
      npcs,
      monsters
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le lieu")
  }

  revalidatePath("/locations")
  redirect("/locations")
}

// --- MISE À JOUR ---
export async function updateLocationAction(id: string, formData: FormData) {
  const name = getString(formData, "name")
  const descriptionText = getString(formData, "description")
  
  // Note: Si descriptionText est vide, on pourrait vouloir GARDER l'ancienne description riche
  // Pour l'instant, on écrase tout (MVP). Pour faire mieux, il faudrait vérifier si le champ a changé.
  const description = descriptionText ? [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [{ _type: 'span', text: descriptionText }]
    }
  ] : []

  const npcs = parseRefs(getString(formData, "npcs"))
  const monsters = parseRefs(getString(formData, "monsters"))

  try {
    await writeClient.patch(id).set({
      name,
      description,
      npcs,
      monsters
    }).commit()
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier le lieu")
  }

  revalidatePath("/locations")
  revalidatePath(`/locations/${id}`)
  redirect(`/locations/${id}`)
}

// --- SUPPRESSION ---
export async function deleteLocationAction(id: string) {
  try {
    await writeClient.delete(id)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  revalidatePath("/locations")
  redirect("/locations")
}