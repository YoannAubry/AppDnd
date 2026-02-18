"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File
  
  if (!file) {
    throw new Error("Aucun fichier reçu")
  }

  // Vérification de sécurité basique (Type)
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image")
  }

  // 1. Lire le contenu du fichier
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // 2. Générer un nom unique (timestamp + nom original nettoyé)
  const filename = Date.now() + "-" + file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
  
  // 3. Définir le chemin de destination (public/uploads)
  // process.cwd() est la racine du projet
  const uploadDir = join(process.cwd(), "public/uploads")
  
  // Créer le dossier s'il n'existe pas
  await mkdir(uploadDir, { recursive: true })

  const filePath = join(uploadDir, filename)

  // 4. Écrire le fichier
  await writeFile(filePath, buffer)

  // 5. Retourner l'URL publique
  return `/uploads/${filename}`
}