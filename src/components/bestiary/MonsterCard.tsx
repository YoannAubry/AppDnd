import Link from 'next/link';
import { AppImage } from '../ui/AppImage';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
// On change le type importé pour éviter les conflits si tu as gardé l'ancien
// Ou tu peux adapter l'interface ici localement pour être sûr
interface MonsterProps {
  id: string;
  name: string;
  slug: string; // C'est une string maintenant !
  image?: string | null; // C'est une string URL !
  type: string;
  stats: {
    hp: string;
    ac: number;
    challenge?: string;
  }
}

export function MonsterCard({ monster }: { monster: any }) { 
  // J'utilise 'any' temporairement pour éviter les erreurs de type pendant la transition
  // car ton fichier types/index.ts est encore calé sur Sanity

  // 1. GESTION DU SLUG (Compatible String ou Objet)
  const slug = typeof monster.slug === 'string' ? monster.slug : monster.slug?.current;
  
  if (!slug) return null;

  // 2. GESTION DE L'IMAGE
  // Si c'est une string (URL Prisma), on l'utilise. Sinon (Sanity object), on ignore ou on adapte.
  // Comme on a migré, on suppose que c'est une URL string.
  const imageUrl = typeof monster.image === 'string' ? monster.image : null;

  return (
    <Link href={`/bestiary/${slug}`}>
      <Card className="flex flex-col group overflow-hidden theme-card hover:border-[var(--accent-primary)] transition-all duration-300 hover:-translate-y-1 shadow-lg">
        
        {/* Image / Placeholder */}
        <div className="relative h-40 bg-[var(--bg-input)] overflow-hidden border-b border-[var(--border-main)] flex items-center justify-center shrink-0">
          <AppImage src={monster.image} alt={monster.name} type="monster" />
          
          {monster.stats?.challenge && (
            <div className="absolute top-2 right-2">
              <Badge color="red" className="shadow-sm">CR {monster.stats.challenge}</Badge>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 flex flex-col gap-2">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] leading-tight">
              {monster.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] italic truncate">{monster.type}</p>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Badge color="green" className="text-xs py-0">PV: {monster.stats?.hp}</Badge>
            <Badge color="blue" className="text-xs py-0">CA: {monster.stats?.ac}</Badge>
          </div>
        </div>

      </Card>
    </Link>
  );
}