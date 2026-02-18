"use client"
import { useTheme } from "../ThemeProvider"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative group">
      <select 
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="
          appearance-none 
          bg-[var(--bg-input)] 
          border border-[var(--border-main)] 
          text-[var(--text-main)] 
          text-sm 
          rounded-md 
          px-3 py-1.5 
          pr-8 
          cursor-pointer 
          focus:outline-none 
          focus:border-[var(--accent-primary)]
          transition-colors
        "
      >
        <option value="dark">🔮 Dark Fantasy</option>
        <option value="paper">📜 Parchemin</option>
        <option value="cyber">🤖 Cyberpunk</option>
        <option value="ether">✨ Ether</option>
        <option value="retro">👾 Rétro 8-bit</option>
        <option value="tactical">🔫 Tactical</option>
        <option value="grimoire">📖 Grimoire</option>
        <option value="minimal">⚪ Minimaliste</option>
      </select>
      
      {/* Petite flèche custom pour faire joli (optionnel) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)] text-xs">
        ▼
      </div>
    </div>
  )
}