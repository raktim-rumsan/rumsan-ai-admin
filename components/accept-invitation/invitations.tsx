"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle2, Handshake } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatRole } from "@/lib/utils";
import { PendingInvitation } from "@/stores";

interface InvitationWithToken
  extends Omit<
    import("@/stores/organizationStore").PendingInvitation,
    "id" | "token"
  > {
  id: string;
  token?: string;
  organizationName?: string;
  workspaceName?: string;
  organization?: {
    id: string;
    name: string;
    slug?: string;
  };
}

interface InvitationsProps {
  invitations: PendingInvitation[];
  isLoading: boolean;
  onAccept: (inv: InvitationWithToken) => void;
}

export function Invitations({
  invitations,
  isLoading,
  onAccept,
}: InvitationsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };
  if (isLoading) {
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
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Notifications
        </h1>
        <p className="text-sm text-gray-500">
          Manage your workspace invitations
        </p>
      </div>

      {/* No Invitations */}
      {!isLoading && invitations.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              You don’t have any pending invitations at the moment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Invitation List */}
      {!isLoading && invitations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {invitations.map((inv) => {
              const isProcessing = acceptingId === inv.id;

              return (
                <div
                  key={inv.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  onMouseEnter={() => setHoveredId(inv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="shrink-0">
                    <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center">
                      <Handshake className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {inv.organizationId}
                        {inv.workspaceId && `/${inv.workspaceId}`}
                      </span>
                      <span className="text-sm text-gray-500">{inv.email}</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-1">
                      You’ve been invited as{" "}
                      <span className="font-medium capitalize">
                        {formatRole(inv.role)} &nbsp;
                      </span>
                      in &nbsp;
                      <span className="font-medium uppercase">
                        {inv?.workspace?.name} &nbsp;
                      </span>
                      Workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                    >
                      {formatRole(inv.role)}
                    </Badge>

                    {hoveredId === inv.id && (
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            setAcceptingId(inv.id);
                            await onAccept(inv);
                            setAcceptingId(null);
                          }}
                          disabled={isProcessing || !inv.token}
                          className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs cursor-pointer"
                        >
                          {acceptingId === inv.id ? (
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
