"use server"

import { writeClient } from "../../lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- CRÉATION ---
export async function createLocationAction(formData: FormData) {
  const name = formData.get("name") as string
  const descriptionText = formData.get("description") as string
  
  // Transformation du texte brut en "Portable Text" (blocs)
  // C'est le format obligatoire pour Sanity
  const description = descriptionText ? [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [{ _type: 'span', text: descriptionText }]
    }
  ] : []

  // Parsing des listes d'IDs
  let npcsRefs = [], monstersRefs = []
  try {
    const n = formData.get("npcs") as string; 
    if(n) npcsRefs = JSON.parse(n).map((id:string) => ({ _type: 'reference', _ref: id, _key: id }));
    
    const m = formData.get("monsters") as string; 
    if(m) monstersRefs = JSON.parse(m).map((id:string) => ({ _type: 'reference', _ref: id, _key: id }));
  } catch(e) {}

  try {
    await writeClient.create({
      _type: "location",
      name,
      description,
      npcs: npcsRefs,
      monsters: monstersRefs
    })
    console.log(`✅ Lieu créé : ${name}`)
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le lieu")
  }

  revalidatePath("/locations")
  redirect("/locations")
}

// --- MISE À JOUR ---
export async function updateLocationAction(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const descriptionText = formData.get("description") as string
  
  // Même logique de conversion texte -> bloc
  const description = descriptionText ? [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [{ _type: 'span', text: descriptionText }]
    }
  ] : []

  let npcsRefs = [], monstersRefs = []
  try {
    const n = formData.get("npcs") as string; 
    if(n) npcsRefs = JSON.parse(n).map((id:string) => ({ _type: 'reference', _ref: id, _key: id }));
    
    const m = formData.get("monsters") as string; 
    if(m) monstersRefs = JSON.parse(m).map((id:string) => ({ _type: 'reference', _ref: id, _key: id }));
  } catch(e) {}

  try {
    await writeClient.patch(id).set({
      name,
      description,
      npcs: npcsRefs,
      monsters: monstersRefs
    }).commit()
    
    console.log(`✅ Lieu mis à jour : ${name}`)
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