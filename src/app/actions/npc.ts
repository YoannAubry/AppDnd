"use server"

import { prisma } from "@/lib/prisma"
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
    const data: any = {
      name,
      role,
      personality,
      history,
      combatType,
      inventory: JSON.stringify(inventory),
      spells: JSON.stringify(spells),
    }

    if (combatType === 'template' && monsterTemplateId) {
      data.monsterTemplate = { connect: { id: monsterTemplateId } }
    } else if (combatType === 'custom') {
      data.customStats = JSON.stringify({ hp, ac })
    }

    await prisma.nPC.create({ data })
    console.log(`✅ PNJ créé : ${name}`)

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
    const data: any = {
      name, role, personality, history, combatType,
      inventory: JSON.stringify(inventory),
      spells: JSON.stringify(spells)
    }

    if (combatType === 'template') {
      data.monsterTemplate = monsterTemplateId ? { connect: { id: monsterTemplateId } } : { disconnect: true }
      data.customStats = null
    } else if (combatType === 'custom') {
      data.customStats = JSON.stringify({ hp, ac })
      data.monsterTemplate = { disconnect: true }
    } else {
      data.monsterTemplate = { disconnect: true }
      data.customStats = null
    }

    await prisma.nPC.update({ where: { id }, data })
    console.log(`✅ PNJ ${name} mis à jour.`)

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
    await prisma.nPC.delete({ where: { id } })
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  revalidatePath("/npcs")
  redirect("/npcs")
}