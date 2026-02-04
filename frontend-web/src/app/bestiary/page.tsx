"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { client } from '../../lib/sanity';
import { Monster } from '../../types';
import { MonsterCard } from '../../components/bestiary/MonsterCard';

async function getMonsters() {
  return await client.fetch(`*[_type == "monster"] | order(name asc) {
    _id, name, slug, image, type,
    stats { ac, hp, challenge }
  }`);
}

export default function BestiaryPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonsters().then(data => {
      setMonsters(data);
      setLoading(false);
    });
  }, []);

  const filtered = monsters.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[var(--border-main)] pb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] font-serif">🐉 Bestiaire</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Base de données ({filtered.length})</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="theme-input w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/bestiary/new" className="theme-btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <span>+</span> Nouveau
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Chargement du grimoire...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(monster => (
            <MonsterCard key={monster._id} monster={monster} />
          ))}
        </div>
      )}
      
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl bg-[var(--bg-card)]/50">
          Aucun monstre trouvé.
        </div>
      )}
    </div>
  );
}