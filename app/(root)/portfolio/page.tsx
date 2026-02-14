import AddPortfolio from "@/components/AddPortfolio";
import { getQuote } from "@/lib/actions/finnhub.actions";

async function getPortfolio() {
  const res = await fetch("http://localhost:3000/api/portfolio", {
    cache: "no-store",
  });

  return res.json();
}

export default async function PortfolioPage() {
  const items = await getPortfolio();

const enrichedItems = await Promise.all(
  items.map(async (item: any) => {
    const quote = await getQuote(item.symbol);

    return {
      ...item,
      currentPrice: quote?.c ?? 0,
    };
  })
);

const totalInvested = enrichedItems.reduce(
  (sum: number, item: any) =>
    sum + item.buyPrice * item.quantity,
  0
);

const totalValue = enrichedItems.reduce(
  (sum: number, item: any) =>
    sum + item.currentPrice * item.quantity,
  0
);

const totalPL = totalValue - totalInvested;

const totalPercent =
  totalInvested > 0
    ? (totalPL / totalInvested) * 100
    : 0;

const isProfit = totalPL >= 0;



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Portfolio</h1>

      <AddPortfolio />
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
  <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <div>
      <p className="text-gray-500 text-sm">Invested</p>
      <p className="text-lg font-bold">
        ${totalInvested.toFixed(2)}
      </p>
    </div>

    <div>
      <p className="text-gray-500 text-sm">Current Value</p>
      <p className="text-lg font-bold">
        ${totalValue.toFixed(2)}
      </p>
    </div>

    <div>
      <p className="text-gray-500 text-sm">P/L</p>
      <p className={`text-lg font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
        ${totalPL.toFixed(2)}
      </p>
    </div>

    <div>
      <p className="text-gray-500 text-sm">% Return</p>
      <p className={`text-lg font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
        {totalPercent.toFixed(2)}%
      </p>
    </div>
  </div>
</div>


      <div className="space-y-4">
        {enrichedItems.map((item: any) => (

          <div
            key={item._id}
            className="p-4 border rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{item.symbol}</p>
              <p>Qty: {item.quantity}</p>
              <p>Buy Price: ${item.buyPrice}</p>
              <p>Current: ${item.currentPrice}</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
