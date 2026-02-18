"use client"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "paper" | "cyber" | "ether" | "retro" | "tactical" | "grimoire" | "minimal"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Au montage, on lit le localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app-theme") as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
    setMounted(true)
  }, [])

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("app-theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  // Évite le flash de contenu incorrect au chargement
  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)