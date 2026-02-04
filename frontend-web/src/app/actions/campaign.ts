"use server"

import { writeClient } from "../../lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- CRÉATION ---
export async function createCampaignAction(formData: FormData) {
  const title = formData.get("title") as string
  const level = formData.get("level") as string
  const synopsis = formData.get("synopsis") as string
  
  // Récupération des Actes (envoyés en JSON par le composant React)
  let acts = []
  try {
    const actsJson = formData.get("acts") as string
    if (actsJson) {
      acts = JSON.parse(actsJson).map((act: any) => ({
        _key: act.id || Math.random().toString(36).substring(7), // Clé unique pour Sanity
        title: act.title,
        summary: act.summary,
        // Transformation des IDs de lieux en références Sanity
        locations: act.locationIds?.map((id: string) => ({
          _key: Math.random().toString(36).substring(7),
          _type: 'reference',
          _ref: id
        })) || []
      }))
    }
  } catch(e) { console.error("JSON Error Acts", e) }

  // Création du Slug (URL)
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    await writeClient.create({
      _type: "campaign",
      title,
      slug: { _type: 'slug', current: slug },
      level,
      synopsis,
      acts
    })
    console.log(`✅ Campagne créée : ${title}`)
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer la campagne")
  }

  revalidatePath("/campaigns")
  redirect(`/campaigns/${slug}`)
}

// --- MISE À JOUR (Pour plus tard) ---
// (Je te la mets pour que le fichier soit complet)
export async function updateCampaignAction(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const level = formData.get("level") as string
  const synopsis = formData.get("synopsis") as string
  
  let acts = []
  try {
    const actsJson = formData.get("acts") as string
    if (actsJson) {
      acts = JSON.parse(actsJson).map((act: any) => ({
        _key: act.id || Math.random().toString(36).substring(7),
        title: act.title,
        summary: act.summary,
        locations: act.locationIds?.map((id: string) => ({
          _key: Math.random().toString(36).substring(7),
          _type: 'reference',
          _ref: id
        })) || []
      }))
    }
  } catch(e) {}

  await writeClient.patch(id).set({ title, level, synopsis, acts }).commit()
  
  revalidatePath("/campaigns")
  redirect("/campaigns") // Redirection vers la liste
}

// --- SUPPRESSION ---
export async function deleteCampaignAction(id: string) {
  await writeClient.delete(id)
  revalidatePath("/campaigns")
  redirect("/campaigns")
}