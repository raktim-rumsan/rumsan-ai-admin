"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { useClearTenant, useUserLoading, useUserProfile } from "@/stores";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function ProfileUserDashboard() {
  const userProfile = useUserProfile();
  const isLoading = useUserLoading();
  const clearTenant = useClearTenant();

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Extract user data with fallbacks
  const getUserDisplayData = () => {
    if (isLoading) {
      return {
        name: "Loading...",
        email: "",
        initials: "...",
      };
    }

    if (!userProfile) {
      return {
        name: "Guest User",
        email: "guest@example.com",
        initials: "GU",
      };
    }

    const name = userProfile.name || userProfile.email?.split("@")[0] || "User";
    const email = userProfile.email || "";
    const initials =
      name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return { name, email, initials };
  };

  const handleLogout = async () => {
    clearTenant();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const { name, email, initials } = getUserDisplayData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg p-2 cursor-pointer focus:outline-none focus-visible:outline-none">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center justify-between py-2">
          <span className="text-sm font-normal">Account</span>
          <Badge variant="secondary" className="text-xs font-medium">
            Admin
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
