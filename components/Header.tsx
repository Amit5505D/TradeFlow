import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="container flex items-center justify-between h-14 relative">

        {/* Left: Logo */}
    <Link href="/" className="flex items-center gap-3">
  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-black font-bold shadow-md">
    TF
  </div>
  <span className="text-xl font-semibold tracking-tight text-white">
    TradeFlow
  </span>
</Link>


        {/* Center: Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </div>

        {/* Right: User */}
        <UserDropdown user={user} initialStocks={initialStocks} />

      </div>
    </header>
  );
};

export default Header;
