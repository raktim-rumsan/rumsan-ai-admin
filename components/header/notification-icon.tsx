"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { useCheckInvitation } from "@/queries/invitationsQuery";
import { toastUtils } from "@/lib/toast-utils";

export function NotificationIcon({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { pendingInvitations, refetch: refetchOrganizationContext } =
    useOrganizationContext();
  const { refetch: refetchCheckInvitation, isRefetching } =
    useCheckInvitation();

  const pendingCount = pendingInvitations?.length || 0;

  const handleClick = async () => {
    try {
      await refetchCheckInvitation();
      await refetchOrganizationContext();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to refresh invitations. Please try again.";
      toastUtils.generic.error("Error", errorMessage);
    } finally {
      const target = pathname.endsWith("/invitations")
        ? pathname
        : `${pathname}/invitations`;
      router.push(target);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative h-9 w-9 p-0"
      onClick={handleClick}
      title="Notifications"
      disabled={isRefetching}
      aria-busy={isRefetching}
    >
      <Bell
        className={`h-5 w-5 text-gray-600 ${
          isRefetching ? "animate-spin" : ""
        }`}
      />
      {pendingCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
          {pendingCount > 9 ? "9+" : pendingCount}
        </Badge>
      )}
    </Button>
  );
}
