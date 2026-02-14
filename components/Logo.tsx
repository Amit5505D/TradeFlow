import { TrendingUp } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      {/* Icon Container */}
      <div className="relative flex items-center justify-center h-10 w-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
        <TrendingUp className="text-white w-6 h-6" strokeWidth={2.5} />
        
        {/* Subtle inner gloss */}
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Text Brand */}
      <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
        Trade<span className="text-gray-400">Flow</span>
      </span>
    </div>
  );
}