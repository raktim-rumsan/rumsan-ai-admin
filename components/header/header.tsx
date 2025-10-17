"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import {
  useTenantId,
  useWorkspaceData,
  useSetTenantId,
} from "@/stores/tenantStore";
import { useTenantQuery } from "@/queries/tenantQuery";
import type { Team } from "@/lib/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CreateTeamDialog } from "../dashboard/CreateTeamDialog";
import { ProfileUserDashboard } from "../profile/profile";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function MainHeader({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const tenantId = useTenantId();
  const workspaceData = useWorkspaceData();
  const setTenantId = useSetTenantId();
  const { data, isLoading } = useTenantQuery();

  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && data?.data?.personal) {
      const slug = data.data.personal.slug;
      // Only set personal workspace as default if no tenantId is currently stored
      // This prevents overriding user's team selection
      if (slug && !tenantId && !localStorage.getItem("tenantId")) {
        localStorage.setItem("tenantId", slug);
        setTenantId(slug);
      }
    }
  }, [isMounted, data, isLoading, tenantId, setTenantId]);

  const handleWorkspaceChange = (value: string) => {
    if (value === "personal") {
      const slug = personalSlug;
      if (slug) {
        setTenantId(slug);
        localStorage.setItem("tenantId", slug);
        // Reload the entire website to refresh all data and state
        window.location.reload();
      }
    } else {
      const slug = value.replace("team-", "");
      setTenantId(slug);
      localStorage.setItem("tenantId", slug);
      // Reload the entire website to refresh all data and state
      window.location.reload();
    }
  };

  const handleTeamCreated = async (teamSlug: string) => {
    console.log("Team created with slug:", teamSlug);
  };

  if (!isMounted || isLoading) return null;

  // Use workspaceData from tenant context for better synchronization
  const teams = workspaceData?.teams || data?.data?.teams || [];
  const personalSlug =
    workspaceData?.personal?.slug || data?.data?.personal?.slug;
  const isPersonalWorkspace = tenantId === personalSlug;
  const currentTeam = teams.find((team: Team) => team.slug === tenantId);

  const currentValue = isPersonalWorkspace
    ? "Demo Workspace"
    : currentTeam
    ? currentTeam.name
    : "Select Workspace";

  // Check if we're in the admin dashboard
  const isAdminDashboard = pathname?.startsWith("/admin");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and hamburger (mobile) or workspace switcher (desktop) */}
        <div className="flex items-center space-x-4">
          {/* Logo and title - visible on mobile dashboard and always in admin dashboard, hidden on desktop dashboard */}
          <div
            className={cn(
              "flex items-center space-x-2",
              !isAdminDashboard && "lg:hidden"
            )}
          >
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Rumsan AI</h1>
          </div>

          {/* Hamburger menu - visible on mobile */}
          {onMenuClick && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Workspace switcher - visible on mobile after hamburger, always visible on desktop, hidden in admin dashboard */}
          {!isAdminDashboard && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 sm:w-56 justify-between",
                    "data-[state=open]:bg-accent"
                  )}
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
                  Demo Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right side - Admin and logout */}

        <ProfileUserDashboard />
      </div>

      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
        onTeamCreated={handleTeamCreated}
      />
    </header>
  );
}
