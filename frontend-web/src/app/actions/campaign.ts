"use server"

import { writeClient } from "@/lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generateSlug, getString } from "@/lib/actions-utils"

function parseActs(jsonString: string): any[] {
  try {
    if (!jsonString) return []
    const acts = JSON.parse(jsonString)
    if (!Array.isArray(acts)) return []
    
    return acts.map((act: any) => ({
      _key: act.id || act._key || Math.random().toString(36).substring(7),
      title: act.title || "Sans titre",
      summary: act.summary || "",
      locations: Array.isArray(act.locationIds) ? act.locationIds.map((id: string) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'reference',
        _ref: id
      })) : []
    }))
  } catch (e) {
    console.warn("Erreur parsing Acts:", e)
    return []
  }
}

// --- CRÉATION ---
export async function createCampaignAction(formData: FormData) {
  const title = getString(formData, "title")
  const level = getString(formData, "level")
  const synopsis = getString(formData, "synopsis")
  
  const acts = parseActs(getString(formData, "acts"))
  const slug = generateSlug(title)

  try {
    await writeClient.create({
      _type: "campaign",
      title,
      slug: { _type: 'slug', current: slug },
      level,
      synopsis,
      acts
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer la campagne")
  }

  revalidatePath("/campaigns")
  redirect(`/campaigns/${slug}`)
}

// --- MISE À JOUR ---
export async function updateCampaignAction(id: string, formData: FormData) {
  const title = getString(formData, "title")
  const level = getString(formData, "level")
  const synopsis = getString(formData, "synopsis")
  
  const acts = parseActs(getString(formData, "acts"))

  try {
    await writeClient.patch(id).set({
      title, level, synopsis, acts
    }).commit()
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/campaigns")
  // Idéalement on redirige vers le slug, mais ici on va vers la liste pour simplifier
  redirect("/campaigns")
}

// --- SUPPRESSION ---
export async function deleteCampaignAction(id: string) {
  try {
    await writeClient.delete(id)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  revalidatePath("/campaigns")
  redirect("/campaigns")
}