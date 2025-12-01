"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, BotMessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CreateTeamDialog } from "../dashboard/CreateTeamDialog";
import { ProfileUserDashboard } from "../profile/profile";
import { NotificationIcon } from "./notification-icon";
import { usePathname } from "next/navigation";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";

interface HeaderProps {
  onMenuClick?: () => void;
  onChatButtonClick?: () => void;
  isChatOpen?: boolean;
}

export function MainHeader({
  onMenuClick,
  onChatButtonClick,
  isChatOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: workspaceData, isLoading, isError } = useWorkspaceQuery(); // ✅ fetch workspaces
  const [currentValue, setCurrentValue] = useState("Select Workspace");

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem("workspaceName");
    if (savedName) setCurrentValue(savedName);
  }, []);

  const handleTeamCreated = async (teamSlug: string) => {
    console.log("Team created with slug:", teamSlug);
  };
  const handleWorkspaceSelect = async (workspace: {
    id: string;
    name: string;
    slug: string;
  }) => {
    localStorage.setItem("workspaceId", workspace.slug);
    localStorage.setItem("workspaceName", workspace.name);
    setCurrentValue(workspace.name);

    // Clear chat history for new workspace
    localStorage.removeItem("chatHistory");
    queryClient.setQueryData(["chatHistory"], []);

    // Reset all queries and force immediate refetch
    await queryClient.resetQueries();
    await queryClient.refetchQueries();
  };

  if (!isMounted) return null;

  // Check if we're in the admin dashboard
  const isAdminDashboard = pathname?.startsWith("/admin");
  const isWorkspaceDashboard = pathname?.startsWith("/dashboard/");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and hamburger (mobile) or workspace switcher (desktop) */}
        <div className="flex items-center space-x-4">
          {/* Logo and title - visible on mobile dashboard and always in admin dashboard, hidden on desktop dashboard */}
          <div
            className={cn(
              "flex items-center space-x-2",
              !isAdminDashboard && isWorkspaceDashboard && "lg:hidden"
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
          {/* {!isAdminDashboard && isWorkspaceDashboard && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 sm:w-56 justify-between",
                    "data-[state=open]:bg-accent"
                  )}
                >
                  <span>
                    {isLoading
                      ? "Loading..."
                      : isError
                      ? "Error loading"
                      : currentValue}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="start">
                {workspaceData?.data?.myWorkspaces.length ? (
                  workspaceData.data.myWorkspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => handleWorkspaceSelect(workspace)}
                    >
                      {workspace.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No workspaces found
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}
        </div>

        {/* Right side - Notifications and Profile */}

        <div className="flex items-center gap-3">
          {!isAdminDashboard && !isWorkspaceDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onChatButtonClick}
              aria-pressed={isChatOpen}
              title={isChatOpen ? "Assistant is open" : "Open assistant"}
            >
              <BotMessageSquare className="h-5 w-5 text-blue-500" />
            </Button>
          )}

          <NotificationIcon />
          <ProfileUserDashboard />
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
