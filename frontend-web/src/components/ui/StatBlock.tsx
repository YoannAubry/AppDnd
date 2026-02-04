import { Badge } from "../ui/Badge"

export function StatBlock({ data }: { data: any }) {
  if (!data) return <div>Chargement...</div>

  const isPlayer = data._type === 'player';

  if (isPlayer) {
    return (
      <div className="font-serif text-[var(--text-main)] p-2">
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border-main)] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">{data.name}</h2>
            <p className="text-[var(--text-muted)] italic">{data.race} • {data.class} Niv {data.level}</p>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-bold text-[var(--accent-primary)]">{data.hpMax} <span className="text-sm text-[var(--text-muted)]">PV MAX</span></span>
            <span className="block text-sm font-bold text-[var(--accent-hover)]">CA {data.ac}</span>
          </div>
        </div>
      </div>
    )
  }

  // MONSTRES / PNJ
  let stats: any = {};
  if (data._type === 'npc') {
    if (data.customStats) stats = data.customStats;
    else if (data.monsterTemplate) stats = data.monsterTemplate.stats || {};
  } else {
    stats = data.stats || {};
  }
  const attributes = stats.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 };

  return (
    <div className="font-serif text-[var(--text-main)]">
      
      {/* HEADER STATS */}
      <div className="flex flex-wrap gap-4 mb-6 text-[var(--accent-primary)] font-bold text-lg border-b border-[var(--accent-primary)]/20 pb-4">
        <span className="flex items-center gap-2">🛡️ CA {stats.ac || 10}</span>
        <span className="flex items-center gap-2">❤️ PV {stats.hp || 10}</span>
        <span className="flex items-center gap-2">🦶 {stats.speed || '?'}</span>
      </div>

      {/* ATTRIBUTS */}
      <div className="grid grid-cols-6 gap-2 text-center mb-6">
        {Object.entries(attributes).map(([key, val]: any) => (
          <div key={key} className="flex flex-col bg-[var(--bg-input)] p-1 rounded border border-[var(--border-main)]">
            <span className="text-[10px] font-bold uppercase text-[var(--accent-primary)]">{key.substring(0,3)}</span>
            <span className="font-bold">{val}</span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {Math.floor((Number(val) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Number(val) - 10) / 2)}
            </span>
          </div>
        ))}
      </div>

      {/* TRAITS & ACTIONS */}
      <div className="space-y-4">
        {stats.traits?.map((t: any, i: number) => (
          <div key={i} className="text-sm">
            <span className="font-bold italic text-[var(--accent-primary)]">{t.name}.</span> {t.desc}
          </div>
        ))}
        
        {stats.actions?.length > 0 && <h4 className="font-bold text-[var(--accent-primary)] border-b border-[var(--border-accent)] mt-4 mb-2 text-sm uppercase tracking-widest">Actions</h4>}
        
        {stats.actions?.map((a: any, i: number) => (
          <div key={i} className="text-sm pl-3 border-l-2 border-[var(--accent-primary)]/30 py-1">
            <span className="font-bold italic text-[var(--accent-primary)]">{a.name}.</span> {a.desc}
          </div>
        ))}
      </div>
    </div>
  )
}