// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-input 
        rounded-xl 
        border border-[var(--border-main)] 
        shadow-lg 
        overflow-hidden 
        transition-all duration-300
        hover:border-accent 
        hover:shadow-purple-500/20 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}