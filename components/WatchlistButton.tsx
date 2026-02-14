"use client";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure you have a cn utility (clsx/tailwind-merge) or use template literals
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

interface WatchlistButtonProps {
  symbol: string;
  company?: string;
  isInWatchlist: boolean;
  type?: "icon" | "full"; // Support both styles
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist: initialState,
  type = "icon",
}: WatchlistButtonProps) {
  const [isActive, setIsActive] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleToggle  = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent clicking the parent card link
    e.stopPropagation();
    
    // Optimistic UI update (feels instant)
    const newState = !isActive;
    setIsActive(newState);
    setLoading(true);

    try {
      // TODO: Call your actual Server Action here
      // await toggleWatchlistAction(symbol); 
      
      // Simulate API delay for demo
      await toggleWatchlist(symbol, company || symbol);


      toast.success(newState ? `Added ${symbol} to watchlist` : `Removed ${symbol}`);
    } catch (error) {
      // Revert if failed
      setIsActive(!newState);
      toast.error("Failed to update watchlist");
    } finally {
      setLoading(false);
    }
  };

  // 1. THE "ICON ONLY" VARIANT (Best for your Card UI)
  if (type === "icon") {
    return (
      <button
        onClick={handleToggle }
        disabled={loading}
        className={cn(
          "group relative flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 focus:outline-none",
          isActive 
            ? "bg-yellow-500/10 text-yellow-500" // Active State
            : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10" // Inactive State
        )}
      >
        {/* Glow Effect behind the star when active */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-yellow-500/20 blur-md transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )} />

        <Star
          size={20}
          className={cn(
            "relative z-10 transition-all duration-300",
            isActive && "fill-yellow-500 scale-110", // Solid star when active
            loading && "animate-pulse"
          )}
          strokeWidth={isActive ? 0 : 2} // Remove stroke when filled for cleaner look
        />
        
        <span className="sr-only">Toggle Watchlist</span>
      </button>
    );
  }

  // 2. THE "FULL BUTTON" VARIANT (Good for Stock Details Page)
  return (
    <button
      onClick={handleToggle }
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border",
        isActive
          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Star
        size={16}
        className={cn(
          "transition-transform duration-300",
          isActive ? "fill-yellow-500 scale-110" : "group-hover:scale-110"
        )}
      />
      {isActive ? "Watching" : "Add to Watchlist"}
    </button>
  );
}