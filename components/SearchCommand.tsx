"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandInput, 
  CommandList, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Loader2, Star, TrendingUp } from "lucide-react"
import { searchStocks } from "@/lib/actions/finnhub.actions"

// Define interfaces if not imported globally
interface StockWithWatchlistStatus {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

type SearchCommandProps = {
  renderAs?: "button" | "text";
  label?: string;
  initialStocks: StockWithWatchlistStatus[];
};


export default function SearchCommand({ 
  renderAs = 'button', 
  label = 'Add stock', 
  initialStocks = [] 
}: SearchCommandProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks)

  const isSearchMode = searchTerm.trim().length > 0;
  
  // Reset stocks when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStocks(initialStocks)
      setSearchTerm("")
    }
  }, [open, initialStocks])

  // Toggle with keyboard shortcut (Cmd+K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Debounced Search Effect
  useEffect(() => {
    // If search is empty, show initial stocks
    if (!searchTerm) {
      setStocks(initialStocks)
      setLoading(false)
      return
    }

    setLoading(true)

    // Debounce timer
    const timer = setTimeout(async () => {
      try {
        const results = await searchStocks(searchTerm.trim())
        setStocks(results || [])
      } catch (error) {
        console.error("Search failed", error)
        setStocks([])
      } finally {
        setLoading(false)
      }
    }, 300)

    // Cleanup function to cancel the previous timer if user keeps typing
    return () => clearTimeout(timer)
  }, [searchTerm, initialStocks])

  const handleSelectStock = (symbol: string) => {
    setOpen(false)
    setSearchTerm("")
    router.push(`/stocks/${symbol}`)
  }

  return (
    <>
      {renderAs === 'text' ? (
        <span 
          role="button" 
          tabIndex={0}
          onClick={() => setOpen(true)} 
          className="search-text cursor-pointer hover:text-primary transition-colors"
        >
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}

      {/* shouldFilter={false} is CRITICAL here. 
         Since we search via API, we don't want cmdk to filter results locally.
      */}
      <CommandDialog open={open} onOpenChange={setOpen}>

        <div className="relative border-b px-3">
            <CommandInput 
            value={searchTerm} 
            onValueChange={setSearchTerm} 
            placeholder="Search stocks..." 
            className="search-input" 
            />
            {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
            )}
        </div>
        
        <CommandList className="search-list max-h-[300px] overflow-y-auto">
          {!loading && stocks.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {stocks.length > 0 && (
            <CommandGroup heading={isSearchMode ? 'Search results' : 'Popular stocks'}>
              {stocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={stock.symbol} // Used for internal ID
                  onSelect={() => handleSelectStock(stock.symbol)}
                  className="flex items-center gap-2 cursor-pointer p-2"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{stock.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {stock.symbol} | {stock.exchange} | {stock.type}
                    </span>
                  </div>
                  
                  <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}