// src/app/bestiary/page.tsx
"use client" // Obligatoire pour utiliser useState

import { useState, useEffect } from 'react';
import { client } from '../../lib/sanity'; 
import { Monster } from '../../types';
import { MonsterCard } from '../../components/bestiary/MonsterCard';

// On déplace la requête ici pour pouvoir l'appeler
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

  // Filtrage
  const filtered = monsters.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-purple-400">🐉 Bestiaire</h1>
          <p className="text-slate-400 mt-2">Base de données des créatures</p>
        </div>
        
        {/* Barre de Recherche */}
        <input
          type="text"
          placeholder="Rechercher (Gobelin, Dragon...)"
          className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">Chargement du grimoire...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(monster => (
            <MonsterCard key={monster._id} monster={monster} />
          ))}
        </div>
      )}
      
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">Aucun monstre trouvé.</div>
      )}
    </div>
  );
}