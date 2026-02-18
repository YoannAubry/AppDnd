// src/lib/actions-utils.ts

/**
 * Génère un slug propre pour l'URL
 * ex: "Le Dragon !" -> "le-dragon"
 */
export function generateSlug(name: string): string {
  if (!name) return "";
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Accents
    .replace(/'/g, "") // <-- AJOUT : Supprime les apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Le reste devient des tirets
    .replace(/(^-|-$)+/g, '');
}

/**
 * Parse une chaîne JSON qui vient d'un input hidden
 * Renvoie un tableau vide si erreur ou vide
 */
export function parseJsonList<T>(jsonString: FormDataEntryValue | null): T[] {
  if (!jsonString || typeof jsonString !== 'string') return [];
  try {
    const list = JSON.parse(jsonString);
    if (!Array.isArray(list)) return [];
    // Filtre basique : on garde si c'est un objet avec un nom, ou une string
    return list.filter((item: any) => 
      typeof item === 'string' || (item.name && item.name.trim() !== "")
    );
  } catch (e) {
    console.warn("Erreur parsing JSON:", e);
    return [];
  }
}

/**
 * Récupère un nombre depuis le FormData avec une valeur par défaut
 */
export function getNumber(formData: FormData, key: string, defaultValue = 0): number {
  const val = formData.get(key);
  return val ? Number(val) : defaultValue;
}

/**
 * Récupère une string depuis le FormData (raccourci)
 */
export function getString(formData: FormData, key: string): string {
  return (formData.get(key) as string) || "";
}