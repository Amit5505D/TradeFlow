import Link from "next/link";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import Logo from "@/components/Logo"; 

const Header = async ({ user }: { user: any }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 relative">

        {/* Left: Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        {/* Center: Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <NavItems initialStocks={initialStocks} />
        </div>

        {/* Right: User - FIXED: Added initialStocks here */}
        <UserDropdown user={user} initialStocks={initialStocks} />

      </div>
    </header>
  );
};

export default Header;