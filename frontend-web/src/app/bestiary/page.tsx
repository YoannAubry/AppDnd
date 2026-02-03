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
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-purple-400">🐉 Bestiaire</h1>
          <p className="text-slate-400 mt-2">Base de données des créatures ({filtered.length})</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:border-purple-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <Link href="/bestiary/new" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition whitespace-nowrap">
            + Nouveau
          </Link>
        </div>
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
        <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
          Aucun monstre trouvé. Créez-en un !
        </div>
      )}
    </div>
  );
}