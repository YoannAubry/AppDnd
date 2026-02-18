// src/components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  className?: string;
}

const colors = {
  red: 'bg-red-900/50 text-red-200 border-red-800',
  blue: 'bg-blue-900/50 text-blue-200 border-blue-800',
  green: 'bg-emerald-900/50 text-emerald-200 border-emerald-800',
  yellow: 'bg-yellow-900/50 text-yellow-200 border-yellow-800',
  purple: 'bg-purple-900/50 text-purple-200 border-purple-800',
  gray: 'bg-slate-700 text-slate-300 border-slate-600',
};

export function Badge({ children, color = 'gray', className = "" }: BadgeProps) {
  return (
    <span className={`
      px-2 py-1 
      rounded-md 
      text-xs font-bold 
      border 
      ${colors[color]} 
      ${className}
    `}>
      {children}
    </span>
  );
}