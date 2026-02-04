import { Badge } from "../ui/Badge"

const STATUSES = {
  blinded: { label: "👁️ Aveuglé", color: "bg-gray-800 text-white" },
  charmed: { label: "❤️ Charmé", color: "bg-pink-500 text-white" },
  frightened: { label: "😱 Effrayé", color: "bg-accent text-white" },
  grappled: { label: "🪢 Agrippé", color: "bg-orange-600 text-white" },
  paralyzed: { label: "⚡ Paralysé", color: "bg-yellow-400 text-black" },
  poisoned: { label: "🤢 Empoisonné", color: "bg-green-600 text-white" },
  prone: { label: "🛌 À terre", color: "bg-amber-800 text-white" },
  stunned: { label: "💫 Étourdi", color: "bg-blue-600 text-white" },
  unconscious: { label: "💤 Inconscient", color: "bg-slate-500 text-white" },
}

export function StatusList({ conditions, onRemove }: { conditions: string[], onRemove: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {conditions.map(c => (
        <span 
          key={c} 
          onClick={() => onRemove(c)}
          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer hover:opacity-80 ${STATUSES[c as keyof typeof STATUSES]?.color || 'bg-gray-500'}`}
        >
          {STATUSES[c as keyof typeof STATUSES]?.label || c} ✖
        </span>
      ))}
    </div>
  )
}