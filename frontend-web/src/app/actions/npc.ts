"use server"

import { writeClient } from "@/lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getNumber, getString, parseJsonList } from "@/lib/actions-utils"

// --- CRÉATION ---
export async function createNPCAction(formData: FormData) {
  const name = getString(formData, "name")
  const role = getString(formData, "role")
  const personality = getString(formData, "personality")
  const history = getString(formData, "history")
  
  const combatType = getString(formData, "combatType")
  const monsterTemplateId = getString(formData, "monsterTemplate")
  
  const hp = getString(formData, "hp")
  const ac = getNumber(formData, "ac")
  
  const inventory = parseJsonList(formData.get("inventory"))
  const spells = parseJsonList(formData.get("spells"))

  try {
    const doc: any = {
      _type: "npc",
      name,
      role,
      personality,
      history,
      combatType,
      inventory,
      spells
    }

    if (combatType === 'template' && monsterTemplateId) {
      doc.monsterTemplate = { _type: 'reference', _ref: monsterTemplateId }
    } else if (combatType === 'custom') {
      doc.customStats = { hp, ac }
    }

    await writeClient.create(doc)
  } catch (error) {
    console.error("Erreur création PNJ:", error)
    throw new Error("Impossible de créer le PNJ")
  }

  revalidatePath("/npcs")
  redirect("/npcs")
}

// --- MISE À JOUR ---
export async function updateNPCAction(id: string, formData: FormData) {
  const name = getString(formData, "name")
  const role = getString(formData, "role")
  const personality = getString(formData, "personality")
  const history = getString(formData, "history")
  
  const combatType = getString(formData, "combatType")
  const monsterTemplateId = getString(formData, "monsterTemplate")
  
  const hp = getString(formData, "hp")
  const ac = getNumber(formData, "ac")
  
  const inventory = parseJsonList(formData.get("inventory"))
  const spells = parseJsonList(formData.get("spells"))

  try {
    const patch: any = {
      name, role, personality, history, combatType,
      inventory, spells
    }

    if (combatType === 'template') {
      patch.monsterTemplate = monsterTemplateId ? { _type: 'reference', _ref: monsterTemplateId } : undefined
      patch.customStats = undefined 
    } else if (combatType === 'custom') {
      patch.customStats = { hp, ac }
      patch.monsterTemplate = undefined
    } else {
      patch.monsterTemplate = undefined
      patch.customStats = undefined
    }

    await writeClient.patch(id).set(patch).commit()
  } catch (error) {
    console.error("Erreur update PNJ:", error)
    throw new Error("Impossible de modifier le PNJ")
  }

  revalidatePath("/npcs")
  revalidatePath(`/npcs/${id}`)
  redirect(`/npcs/${id}`)
}

// --- SUPPRESSION ---
export async function deleteNPCAction(id: string) {
  try {
    await writeClient.delete(id)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  revalidatePath("/npcs")
  redirect("/npcs")
}