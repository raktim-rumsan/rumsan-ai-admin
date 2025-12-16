"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, BotMessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateTeamDialog } from "../dashboard/CreateTeamDialog";
import { ProfileUserDashboard } from "../profile/profile";
import { NotificationIcon } from "./notification-icon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBackendFileUrl } from "@/queries/organizationQuery";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";

interface HeaderProps {
  onMenuClick?: () => void;
  onChatButtonClick?: () => void;
  isChatOpen?: boolean;
  isShowChatIcon?: boolean;
}

export function MainHeader({
  onMenuClick,
  onChatButtonClick,
  isChatOpen,
  isShowChatIcon = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: workspaceData, isLoading } = useWorkspaceQuery();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Route checks
  const isAdminDashboard = pathname?.startsWith("/admin");
  const isWorkspaceDashboard = pathname?.startsWith("/dashboard/");
  const isWorkspaceLogo = pathname === "/dashboard";
  const isInvitation = pathname === "/dashboard/invitations";

  // Determine if workspace logo should be displayed
  const shouldShowWorkspaceLogo =
    !isWorkspaceLogo && !isInvitation && !isAdminDashboard;

  // Get workspace slug from pathname
  const workspaceSlug = pathname?.split("/")[3];

  // Find the workspace by slug
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w) => w.slug === workspaceSlug
  );

  // Get workspace image URL
  const workspaceImageUrl = currentWorkspace?.url
    ? getBackendFileUrl(currentWorkspace.url)!
    : null;
  const formatWorkspaceName = (name?: string) => {
    const trimmed = name?.trim();
    if (!trimmed) return "Workspace";
    return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  };
  const workspaceDisplayName = formatWorkspaceName(currentWorkspace?.name);
  const workspaceInitial = workspaceDisplayName.charAt(0) || "W";

  return (
    <header className="bg-white border-b border-gray-200 px-4 pt-[4px] lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo, Hamburger menu, and Workspace Image */}
        <div className="flex items-center">
          {/* Logo and title - visible on mobile dashboard and always in admin dashboard, hidden on desktop dashboard */}
          <Link href={"/dashboard"}>
            <div
              className={cn(
                "flex items-center space-x-2",
                !isAdminDashboard &&
                  isWorkspaceDashboard &&
                  !isInvitation &&
                  "lg:hidden"
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
          </Link>

          {/* Hamburger menu - visible on mobile */}
          {onMenuClick && isWorkspaceDashboard && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Workspace Image */}
          {shouldShowWorkspaceLogo && (
            <div className="flex justify-center">
              {isLoading ? (
                <Skeleton className="w-[250px] h-[76px] mb-[4px] rounded-md" />
              ) : workspaceImageUrl ? (
                <Image
                  width={250}
                  height={40}
                  src={workspaceImageUrl}
                  alt="Workspace Logo"
                  className="w-[250px] h-[80px] object-contain rounded-md"
                />
              ) : (
                <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 px-3 py-2 text-slate-900 shadow-sm ring-1 ring-blue-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm ring-2 ring-blue-200">
                    <span className="text-lg font-bold leading-none">
                      {workspaceInitial}
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] uppercase tracking-wide text-blue-600/80">
                      Workspace
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {workspaceDisplayName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-3">
          {isShowChatIcon && (
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
          <NotificationIcon pathname={pathname} />
          <ProfileUserDashboard />
        </div>
      </div>

      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
        onTeamCreated={() => {}}
      />
    </header>
  );
}
