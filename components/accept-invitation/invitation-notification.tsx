"use client";

import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { useAcceptInvitation } from "@/queries/invitationsQuery";
import { toastUtils } from "@/lib/toast-utils";
import { useQueryClient } from "@tanstack/react-query";
import { Invitations } from "./invitations";

export default function NotificationPage() {
  const { pendingInvitations, isLoading, refetch } = useOrganizationContext();
  const acceptMutation = useAcceptInvitation();
  const queryClient = useQueryClient();
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
  const handleAccept = async (invitation: InvitationWithToken) => {
    try {
      if (!invitation.token) {
        toastUtils.generic.info(
          "Use Email Link",
          "Please use the acceptance link from your invitation email."
        );
        return;
      }

      await acceptMutation.mutateAsync({
        token: invitation.token,
        invitationId: invitation.id,
      });

      toastUtils.generic.success(
        "Invitation Accepted",
        "You’ve joined the workspace!"
      );

      if (invitation.workspace) {
        localStorage.setItem("workspaceId", invitation.workspace.slug);
        localStorage.setItem("workspaceName", invitation.workspace.name);
        queryClient.setQueryData(["chatHistory"], []);
        window.location.reload();
      }
    } catch (err) {
      toastUtils.generic.error("Error", "Failed to accept invitation.");
    }
  };

  const handleDecline = async (id: string) => {
    toastUtils.generic.success("Invitation Declined", "Declined successfully.");
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Invitations
        invitations={pendingInvitations ?? []}
        isLoading={isLoading}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
}
