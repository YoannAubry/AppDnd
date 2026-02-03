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
        bg-slate-800 
        rounded-xl 
        border border-slate-700 
        shadow-lg 
        overflow-hidden 
        transition-all duration-300
        hover:border-purple-500 
        hover:shadow-purple-500/20 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}