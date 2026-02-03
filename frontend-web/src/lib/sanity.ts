import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Ta configuration
export const client = createClient({
  projectId: '5hbzc0ty', // Mets ton vrai ID ici (vu dans tes captures)
  dataset: 'production',
  apiVersion: '2026-02-02', // Date d'aujourd'hui
  useCdn: false, // false = données toujours fraîches (mieux pour le dév)
})

// Petit utilitaire pour afficher les images facilement
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}
