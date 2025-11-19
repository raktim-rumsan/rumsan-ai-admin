"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle2, XCircle, GitBranch } from "lucide-react";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { useAcceptInvitation } from "@/queries/invitationsQuery";
import { toastUtils } from "@/lib/toast-utils";
import { formatDistanceToNow } from "date-fns";

interface InvitationWithToken
  extends Omit<
    import("@/stores/organizationStore").PendingInvitation,
    "id" | "token"
  > {
  id: string;
  token?: string;
  organizationName?: string;
  workspaceName?: string;
}

export default function NotificationsPage() {
  const { pendingInvitations, isLoading, isLoaded, refetch } =
    useOrganizationContext();
  const acceptMutation = useAcceptInvitation();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAccept = async (invitation: InvitationWithToken) => {
    // If no token, redirect to accept invitation page with invitation ID
    // The user will need to use the email link, but we can show them where to go
    if (!invitation.token) {
      toastUtils.generic.info(
        "Use Email Link",
        "Please use the acceptance link from your invitation email to accept this invitation."
      );
      // Optionally redirect to a page that explains how to accept
      return;
    }

    setAcceptingId(invitation.id);
    try {
      await acceptMutation.mutateAsync({
        token: invitation.token,
        invitationId: invitation.id,
      });
      toastUtils.generic.success(
        "Invitation Accepted",
        `You've successfully joined ${
          invitation.organizationName || "the organization"
        }!`
      );
      // Refetch to update the list
      await refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to accept invitation. Please try again.";
      toastUtils.generic.error("Error", errorMessage);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setDecliningId(invitationId);
    // TODO: Implement decline invitation API call if available
    // For now, just remove from local state after a delay
    setTimeout(() => {
      setDecliningId(null);
      toastUtils.generic.success(
        "Invitation Declined",
        "The invitation has been declined."
      );
      refetch();
    }, 500);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  // Show skeleton loader while fetching invitations or data not loaded yet
  if (isLoading || !isLoaded) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* List Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* List items skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-4 py-3 border-b border-gray-200 last:border-b-0 flex items-center gap-3"
            >
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-96" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Only show content after data is loaded
  const hasInvitations = pendingInvitations && pendingInvitations.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Notifications
        </h1>
        <p className="text-sm text-gray-500">
          Manage your workspace invitations
        </p>
      </div>

      {/* Notifications List */}
      {!hasInvitations ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              You don&apos;t have any pending invitations at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* List Items */}
          <div className="divide-y divide-gray-200">
            {pendingInvitations.map((invitation, index) => {
              const invitationWithToken =
                invitation as unknown as InvitationWithToken;
              const isAccepting = acceptingId === invitation.id;
              const isDeclining = decliningId === invitation.id;
              const isProcessing = isAccepting || isDeclining;
              const isFirst = index === 0;

              const isHovered = hoveredId === invitation.id;

              return (
                <div
                  key={invitation.id}
                  className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isFirst ? "bg-blue-50" : ""
                  }`}
                  onMouseEnter={() => setHoveredId(invitation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center">
                      <GitBranch className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {invitation.organizationId}
                        {invitation.workspaceId && `/${invitation.workspaceId}`}
                      </span>
                      <span className="text-sm text-gray-500">
                        {invitation.email}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      You&apos;ve been invited to join as{" "}
                      <span className="font-medium capitalize">
                        {invitation.role}
                      </span>{" "}
                      in{" "}
                      <span className="font-medium capitalize">
                        {" "}
                        {invitation.organization.name}
                      </span>{" "}
                      Organization.
                    </p>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                    >
                      {invitation.role}
                    </Badge>

                    {/* Avatar */}
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-semibold">
                        {getInitials(invitation.email)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(invitation.invitedAt)}
                    </span>

                    {/* Accept/Decline Buttons - Show on hover */}
                    {isHovered && (
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitationWithToken)}
                          disabled={isProcessing || !invitationWithToken.token}
                          className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                        >
                          {isAccepting ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                              Accepting
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1.5" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invitation.id)}
                          disabled={isProcessing}
                          className="border-red-200 text-red-600 hover:bg-red-50 h-7 px-3 text-xs"
                        >
                          {isDeclining ? (
                            <>
                              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1.5" />
                              Declining
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1.5" />
                              Decline
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
