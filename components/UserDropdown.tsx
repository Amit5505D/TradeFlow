'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";

// 🎨 Generate consistent color based on name
const getAvatarGradient = (name: string) => {
  const colors = [
    "from-yellow-400 to-orange-500",
    "from-blue-500 to-purple-600",
    "from-emerald-400 to-teal-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
  ];

  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserDropdown = ({
  user,
  initialStocks,
}: {
  user: User | null;
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const router = useRouter();

  if (!user) {
    return (
      <Button
        variant="ghost"
        className="text-gray-400 hover:text-yellow-500 transition"
        onClick={() => router.push("/sign-in")}
      >
        Sign in
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const gradient = getAvatarGradient(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 hover:text-yellow-500 transition"
        >
          {/* 🔥 Premium Avatar */}
          <Avatar className="h-9 w-9 ring-2 ring-white/10 shadow-md">
            <AvatarFallback
              className={`bg-gradient-to-r ${gradient} text-white font-bold text-sm`}
            >
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-300">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-gray-300 bg-zinc-900 border border-white/10 backdrop-blur-md">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-11 w-11 ring-2 ring-white/10 shadow-lg">
              <AvatarFallback
                className={`bg-gradient-to-r ${gradient} text-white font-bold`}
              >
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {user.name}
              </span>
              <span className="text-xs text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer focus:bg-transparent focus:text-yellow-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>

        <DropdownMenuSeparator className="hidden sm:block bg-white/10" />

        <nav className="sm:hidden">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
