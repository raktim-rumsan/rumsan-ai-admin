"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Plus, ChevronDown } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useTenant } from "@/providers/TenantProvider";
import { useTenantQuery } from "@/queries/tenantQuery";
import { CreateTeamDialog } from "./CreateTeamDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

  const { setTenantId, clearTenant, tenantId, workspaceData } = useTenant();
  const { data, isLoading } = useTenantQuery();

  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && data?.data?.personal) {
      const slug = data.data.personal.slug;
      if (slug) {
        localStorage.setItem("tenantId", slug);
      }
    }
  }, [isMounted, data, isLoading]);

  const handleWorkspaceChange = (value: string) => {
    if (value === "personal") {
      const slug = personalSlug;
      if (slug) {
        setTenantId(slug);
      }
    } else if (value.startsWith("team-")) {
      const slug = value.replace("team-", "");
      setTenantId(slug);
    }
  };

  const handleLogout = async () => {
    clearTenant();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleAddTeam = () => {
    setCreateTeamDialogOpen(true);
  };

  const handleTeamCreated = async (teamSlug: string) => {
    // Wait a bit for the query to refetch, then the UI should update automatically
    // The tenant context will handle the state update
    console.log("Team created with slug:", teamSlug);
  };

  if (!isMounted || isLoading) return null;

  // Use workspaceData from tenant context for better synchronization
  const teams = workspaceData?.teams || data?.data?.teams || [];
  const personalSlug = workspaceData?.personal?.slug || data?.data?.personal?.slug;
  const isPersonalWorkspace = tenantId === personalSlug;
  const currentTeam = teams.find((team) => team.slug === tenantId);

  const currentValue = isPersonalWorkspace
    ? "Personal Workspace"
    : currentTeam
    ? currentTeam.name
    : "Select Workspace";

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and hamburger (mobile) or workspace switcher (desktop) */}
        <div className="flex items-center space-x-4">
          {/* Logo - visible on mobile */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Rumsan AI</h1>
          </div>

          {/* Hamburger menu - visible on mobile */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Workspace switcher - visible on mobile after hamburger, always visible on desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-40 sm:w-56 justify-between", "data-[state=open]:bg-accent")}
              >
                <span>{currentValue}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem
                onClick={() => handleWorkspaceChange("personal")}
                className={isPersonalWorkspace ? "bg-accent" : ""}
              >
                Personal Workspace
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className={!isPersonalWorkspace ? "bg-accent" : ""}>
                  Team Workspace
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  {teams.length > 0 ? (
                    <>
                      {teams.map((team) => (
                        <DropdownMenuItem
                          key={team.id}
                          onClick={() => handleWorkspaceChange(`team-${team.slug}`)}
                          className={tenantId === team.slug ? "bg-accent" : ""}
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
        </div>

        {/* Right side - Admin and logout */}
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

      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
        onTeamCreated={handleTeamCreated}
      />
    </header>
  );
}
