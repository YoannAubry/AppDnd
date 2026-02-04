// src/components/bestiary/MonsterCard.tsx
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Monster } from '../../types';
import { urlFor } from '../../lib/sanity';


interface MonsterCardProps {
  monster: Monster;
}

export function MonsterCard({ monster }: MonsterCardProps) {
  // Sécurité
  if (!monster.slug?.current) return null; 

  return (
    <Link href={`/bestiary/${monster.slug.current}`}>
      <Card className="h-full flex flex-col group">
        {/* Image */}
        <div className="relative h-48 theme-card overflow-hidden border-b border-[var(--border-main)]">
          {monster.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={urlFor(monster.image).width(400).url()} 
              alt={monster.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">👾</div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge color="red">CR {monster.stats.challenge}</Badge>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] mb-1">
            {monster.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] italic mb-4">{monster.type}</p>
          
          <div className="mt-auto flex gap-2">
            <Badge color="green">PV: {monster.stats.hp}</Badge>
            <Badge color="blue">CA: {monster.stats.ac}</Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}