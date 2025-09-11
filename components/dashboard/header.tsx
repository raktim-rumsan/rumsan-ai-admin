"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Plus } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useTenant } from "@/providers/TenantProvider";
import { useTenantQuery } from "@/queries/tenantQuery";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { tenantId, setTenantId, clearTenant } = useTenant();
  const { data, isLoading, refetch } = useTenantQuery();

  const [workspaceType, setWorkspaceType] = useState<"personal" | "team">("personal");
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && data?.data?.personal) {
      setWorkspaceType("personal");
      localStorage.setItem("tenantId", data.data.personal.slug);
    }
  }, [isMounted, data, isLoading]);

  const handleWorkspaceChange = (value: string) => {
    if (value === "personal") {
      setWorkspaceType("personal");
      setSelectedTeamSlug(null);
      const slug = data?.data?.personal?.slug;
      if (slug) {
        setTenantId(slug);
      }
    } else if (value.startsWith("team-")) {
      setWorkspaceType("team");
      const slug = value.replace("team-", "");
      setSelectedTeamSlug(slug);
      setTenantId(slug);
    }
  };

  const handleLogout = async () => {
    clearTenant();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleAddTeam = () => {
    // Navigate to team creation page or open a modal
    router.push("/dashboard/organization");
  };

  if (!isMounted || isLoading) return null;

  const teams = data?.data?.teams || [];
  const currentValue =
    workspaceType === "personal"
      ? "Personal Workspace"
      : selectedTeamSlug
      ? teams.find((team) => team.slug === selectedTeamSlug)?.name || "Team Workspace"
      : "Select Workspace";

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-40 sm:w-56 justify-between", "data-[state=open]:bg-accent")}
            >
              {currentValue}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem
              onClick={() => handleWorkspaceChange("personal")}
              className={workspaceType === "personal" ? "bg-accent" : ""}
            >
              Personal Workspace
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={workspaceType === "team" ? "bg-accent" : ""}>
                Team Workspace
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {teams.length > 0 ? (
                  <>
                    {teams.map((team) => (
                      <DropdownMenuItem
                        key={team.id}
                        onClick={() => handleWorkspaceChange(`team-${team.slug}`)}
                        className={selectedTeamSlug === team.slug ? "bg-accent" : ""}
                      >
                        {team.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleAddTeam}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={handleAddTeam}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center lg:hidden">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Rumsan AI</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 hidden sm:inline">Admin</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
