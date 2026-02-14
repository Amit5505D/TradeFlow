import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import WatchlistButton from "@/components/WatchlistButton";
import { redirect } from "next/navigation";
import { getQuote } from "@/lib/actions/finnhub.actions";
import { Activity, Zap } from "lucide-react";
import LivePrice from "@/components/LivePrice";
import MiniChart from "@/components/MiniChart";
import Link from "next/link";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  await connectToDatabase();

  const items = await Watchlist.find({
    userId: session.user.id,
  }).lean();

  const watchlistWithPrices = await Promise.all(
    items.map(async (item: any) => {
      const quote = await getQuote(item.symbol);

      return {
        ...item,
        price: quote?.c ?? 0,
        change: quote?.dp ?? 0,
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      <div className="max-w-7xl mx-auto py-16 px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Market Watch
            </h1>
            <p className="text-gray-400 mt-3 flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" />
              Real-time portfolio tracking
            </p>
          </div>
        </div>

        {watchlistWithPrices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <Zap size={24} className="text-yellow-500 mb-4" />
            <p className="text-gray-500 text-lg">
              Your watchlist is empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistWithPrices.map((item: any) => (
              <Link
                key={item._id.toString()}
                href={`/stocks/${item.symbol}`}
                className="block"
              >
                <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden cursor-pointer">

                  {/* TOP */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold">
                        {item.symbol[0]}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg tracking-wide">
                          {item.symbol}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium truncate max-w-[120px]">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <WatchlistButton
                      symbol={item.symbol}
                      company={item.company}
                      isInWatchlist={true}
                      type="icon"
                    />
                  </div>

                  {/* BOTTOM */}
                  <div className="space-y-4">
                    <LivePrice
                      symbol={item.symbol}
                      initialPrice={item.price}
                      initialChange={item.change}
                    />

                    <MiniChart symbol={item.symbol} />
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
