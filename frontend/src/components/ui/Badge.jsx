import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function Badge({ children, variant = 'default', className }) {
const variants = {
    default: "bg-slate-800 text-slate-300",
    low: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    suspicious: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    scam: "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse",
    critical: "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse",
    safe: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  }
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  )
}
