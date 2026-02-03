// src/lib/sanityWrite.ts
import { createClient } from "next-sanity"

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2026-02-02",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})