export function HealthBar({ current, max }: { current: number, max: number }) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100))
  let color = "bg-green-500"
  if (percent < 50) color = "bg-yellow-500"
  if (percent < 25) color = "bg-red-600"

  return (
    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
    </div>
  )
}