import { Badge } from "../ui/Badge"

export function StatBlock({ data }: { data: any }) {
  if (!data) return <div>Chargement...</div>

  const isPlayer = data._type === 'player';

  // --- VERSION JOUEUR (SIMPLE) ---
  if (isPlayer) {
    return (
      <div className="font-serif text-slate-900 p-2">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{data.name}</h2>
            <p className="text-slate-500 italic">{data.race} • {data.class} Niv {data.level}</p>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-bold text-green-600">{data.hpMax} <span className="text-sm text-slate-400">PV MAX</span></span>
            <span className="block text-sm font-bold text-blue-600">CA {data.ac}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded text-center text-slate-500 italic text-sm">
          Le joueur gère ses propres sorts et inventaire.
        </div>
      </div>
    )
  }

  // --- VERSION MONSTRE / PNJ (COMPLET) ---
  // (On garde la logique d'avant pour eux)
  let stats: any = {};
  if (data._type === 'npc') {
    if (data.customStats) stats = data.customStats;
    else if (data.monsterTemplate) stats = data.monsterTemplate.stats || {};
  } else {
    stats = data.stats || {};
  }
  const attributes = stats.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 };

  return (
    <div className="font-serif text-slate-900">
      {/* En-tête Stats */}
      <div className="flex flex-wrap gap-4 mb-6 text-[#7a200d] font-bold text-lg border-b border-[#7a200d]/20 pb-4">
        <span className="flex items-center gap-2">🛡️ CA {stats.ac || 10}</span>
        <span className="flex items-center gap-2">❤️ PV {stats.hp || 10}</span>
        <span className="flex items-center gap-2">🦶 {stats.speed || '?'}</span>
      </div>

      {/* Attributs */}
      <div className="grid grid-cols-6 gap-2 text-center mb-6">
        {Object.entries(attributes).map(([key, val]: any) => (
          <div key={key} className="flex flex-col bg-[#fdf1dc] p-1 rounded border border-[#eecfa1]">
            <span className="text-[10px] font-bold uppercase text-[#7a200d]">{key.substring(0,3)}</span>
            <span className="font-bold">{val}</span>
            <span className="text-[10px] text-slate-500">
              {Math.floor((Number(val) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Number(val) - 10) / 2)}
            </span>
          </div>
        ))}
      </div>

      {/* Traits & Actions */}
      <div className="space-y-4">
        {stats.traits?.map((t: any, i: number) => (
          <div key={i} className="text-sm">
            <span className="font-bold italic text-[#7a200d]">{t.name}.</span> {t.desc}
          </div>
        ))}
        
        {stats.actions?.length > 0 && <h4 className="font-bold text-[#7a200d] border-b border-[#7a200d] mt-4">Actions</h4>}
        
        {stats.actions?.map((a: any, i: number) => (
          <div key={i} className="text-sm pl-2 border-l-2 border-[#7a200d]/20">
            <span className="font-bold italic text-[#7a200d]">{a.name}.</span> {a.desc}
          </div>
        ))}
      </div>
    </div>
  )
}