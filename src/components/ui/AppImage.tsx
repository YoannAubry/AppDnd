"use client"
/* eslint-disable @next/next/no-img-element */

interface AppImageProps {
  src?: string | null
  alt: string
  type: 'monster' | 'npc' | 'player' | 'location' | 'campaign'
  className?: string
  iconClassName?: string
}

export function AppImage({ src, alt, type, className = "", iconClassName = "" }: AppImageProps) {
  // Icône par défaut selon le type
  const getIcon = () => {
    switch (type) {
      case 'monster': return '👾';
      case 'npc': return '👤';
      case 'player': return '🛡️';
      case 'location': return '🏰';
      case 'campaign': return '📜';
      default: return '❓';
    }
  }

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={`object-cover w-full h-full ${className}`} 
      />
    )
  }

  return (
    <div className={`flex items-center justify-center bg-[var(--bg-input)] text-[var(--text-muted)] w-full h-full ${className}`}>
      <span className={`text-4xl opacity-50 ${iconClassName}`}>
        {getIcon()}
      </span>
    </div>
  )
}