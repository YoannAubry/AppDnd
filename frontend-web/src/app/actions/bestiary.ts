"use server"

import { writeClient } from "../../lib/sanityWrite"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createMonsterAction(formData: FormData) {
  // 1. Récupération des champs simples
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  
  const hp = formData.get("hp") as string
  const ac = Number(formData.get("ac"))
  const speed = formData.get("speed") as string
  const challenge = formData.get("challenge") as string
  
  const senses = formData.get("senses") as string
  const languages = formData.get("languages") as string

  // 2. Récupération des Attributs (avec valeur par défaut 10)
  const str = Number(formData.get("str")) || 10
  const dex = Number(formData.get("dex")) || 10
  const con = Number(formData.get("con")) || 10
  const int = Number(formData.get("int")) || 10
  const wis = Number(formData.get("wis")) || 10
  const cha = Number(formData.get("cha")) || 10

  // 3. Parsing des Listes Dynamiques (Traits & Actions)
  // Elles arrivent sous forme de string JSON depuis le composant DynamicList
  let traits = []
  let actions = []

  try {
    const traitsRaw = formData.get("traits") as string
    if (traitsRaw) {
      // On filtre les éléments vides (ceux qui n'ont pas de nom)
      traits = JSON.parse(traitsRaw).filter((t: any) => t.name && t.name.trim() !== "")
    }

    const actionsRaw = formData.get("actions") as string
    if (actionsRaw) {
      actions = JSON.parse(actionsRaw).filter((a: any) => a.name && a.name.trim() !== "")
    }
  } catch (e) {
    console.error("❌ Erreur lors du parsing des actions/traits JSON:", e)
    // On ne bloque pas la création, mais les listes seront vides
  }

  // 4. Génération du Slug (URL friendly)
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Remplace caractères spéciaux par tiret
    .replace(/(^-|-$)+/g, '')    // Retire tirets début/fin

  try {
    // 5. Envoi à Sanity
    await writeClient.create({
      _type: "monster",
      name,
      slug: { _type: 'slug', current: slug },
      type,
      // Image: on ne gère pas l'upload ici pour simplifier, ça se fait via le Studio pour l'instant
      stats: {
        hp, 
        ac, 
        speed, 
        challenge,
        senses,
        languages,
        attributes: { str, dex, con, int, wis, cha },
        traits,  // Tableau d'objets {name, desc}
        actions  // Tableau d'objets {name, desc}
      }
    })

    console.log(`✅ Monstre créé avec succès : ${name} (${slug})`)

  } catch (error) {
    console.error("❌ Erreur critique lors de la création Sanity:", error)
    throw new Error("Impossible de créer le monstre. Vérifiez les logs serveur.")
  }

  // 6. Rafraîchissement du cache et Redirection
  revalidatePath("/bestiary") // Invalide le cache de la liste
  redirect(`/bestiary/${slug}`) // Emmène l'utilisateur sur la fiche créée
}

export async function updateMonsterAction(id: string, formData: FormData) {
  // (Même logique de récupération que create, mais on update)
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const hp = formData.get("hp") as string
  const ac = Number(formData.get("ac"))
  // ... (récupérer tous les autres champs comme dans create) ...
  
  // Pour faire court ici, je copie la logique JSON
  let traits = [], actions = []
  try {
    const t = formData.get("traits") as string; if(t) traits = JSON.parse(t);
    const a = formData.get("actions") as string; if(a) actions = JSON.parse(a);
  } catch(e) {}

  await writeClient.patch(id).set({
    name, type,
    stats: {
      hp, ac, 
      // ... remettre tous les champs
      traits, actions
    }
  }).commit()

  revalidatePath("/bestiary")
  revalidatePath(`/bestiary/${formData.get("slug")}`) // On suppose qu'on a le slug
  redirect(`/bestiary`)
}

// --- SUPPRESSION ---
export async function deleteMonsterAction(id: string) {
  try {
    await writeClient.delete(id)
    console.log(`🗑️ Document ${id} supprimé.`)
  } catch (err) {
    console.error("Erreur suppression:", err)
    throw new Error("Erreur suppression")
  }
  
  revalidatePath("/bestiary")
  redirect("/bestiary")
}