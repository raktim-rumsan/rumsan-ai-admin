"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, BotMessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateTeamDialog } from "../dashboard/CreateTeamDialog";
import { ProfileUserDashboard } from "../profile/profile";
import { NotificationIcon } from "./notification-icon";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTeamCreated = async (teamSlug: string) => {
    console.log("Team created with slug:", teamSlug);
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

          <Link href={"/dashboard"}>
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
        onTeamCreated={handleTeamCreated}
      />
    </header>
  );
}
