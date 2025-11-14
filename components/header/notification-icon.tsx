"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

export function NotificationIcon() {
  const router = useRouter();
  const { pendingInvitations } = useOrganizationContext();
  const pendingCount = pendingInvitations?.length || 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative h-9 w-9 p-0"
      onClick={() => router.push("/invitation-pending")}
      title="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {pendingCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
          {pendingCount > 9 ? "9+" : pendingCount}
        </Badge>
      )}
    </Button>
  );
}
