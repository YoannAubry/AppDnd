"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generateSlug, getString, parseJsonList } from "@/lib/actions-utils"

// --- CRÉATION ---
export async function createCampaignAction(formData: FormData) {
  const title = getString(formData, "title")
  const actsData = parseJsonList(formData.get("acts")) as any[]

  try {
    await prisma.campaign.create({
      data: {
        title,
        slug: generateSlug(title),
        level: getString(formData, "level"),
        synopsis: getString(formData, "synopsis"),
        acts: {
          create: actsData.map((act, i) => ({
            title: act.title,
            summary: act.summary,
            order: i,
            locations: {
              connect: (act.locationIds || []).map((id: string) => ({ id }))
            }
          }))
        }
      }
    })
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer la campagne")
  }

  revalidatePath("/campaigns")
  redirect("/campaigns")
}

// --- UPDATE ---
export async function updateCampaignAction(id: string, formData: FormData) {
  const actsData = parseJsonList(formData.get("acts")) as any[]

  try {
    // Stratégie brutale mais efficace pour les nested relations en update :
    // 1. Supprimer tous les anciens actes
    // 2. Recréer les nouveaux
    // (Prisma n'aime pas trop l'update profond de listes imbriquées complexes)
    
    await prisma.$transaction([
      prisma.act.deleteMany({ where: { campaignId: id } }),
      prisma.campaign.update({
        where: { id },
        data: {
          title: getString(formData, "title"),
          level: getString(formData, "level"),
          synopsis: getString(formData, "synopsis"),
          acts: {
            create: actsData.map((act, i) => ({
              title: act.title,
              summary: act.summary,
              order: i,
              locations: {
                connect: (act.locationIds || []).map((locId: string) => ({ id: locId }))
              }
            }))
          }
        }
      })
    ])
    
  } catch (error) {
    console.error("Erreur update:", error)
    throw new Error("Impossible de modifier")
  }

  revalidatePath("/campaigns")
  redirect("/campaigns")
}

// --- DELETE ---
export async function deleteCampaignAction(id: string) {
  await prisma.campaign.delete({ where: { id } })
  revalidatePath("/campaigns")
  redirect("/campaigns")
}