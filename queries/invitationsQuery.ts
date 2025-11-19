import { ROUTES } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";
import type { OrganizationContextResponse } from "@/queries/organizationQuery";
import type { WorkspacesMemberResponse } from "@/queries/workspaceQuery";

export type ResendInvitationData = {
  invitationId: string;
  email: string;
  orgId: string;
  workspaceId: string;
};

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const access_token = getAuthToken();

  return useMutation({
    mutationFn: async (
      params: string | { token: string; invitationId?: string }
    ) => {
      // Support both string (token) and object (token + invitationId) for backward compatibility
      const token = typeof params === "string" ? params : params.token;
      // Try with token in body first (most common)
      const res = await fetch(ROUTES.INVITATION_ACCEPT, {
        method: "POST",
        headers: {
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onMutate: async (params) => {
      // Extract invitationId if provided
      const invitationId =
        typeof params === "object" ? params.invitationId : undefined;

      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: ["organizationContext", access_token],
      });
      await queryClient.cancelQueries({
        queryKey: ["workspaces", "invitations"],
      });

      // Snapshot the previous values
      const previousOrgContext =
        queryClient.getQueryData<OrganizationContextResponse>([
          "organizationContext",
          access_token,
        ]);
      const previousInvitations = queryClient.getQueryData([
        "workspaces",
        "invitations",
      ]);

      // Optimistically update organization context if we have invitationId
      if (invitationId && previousOrgContext) {
        queryClient.setQueryData<OrganizationContextResponse>(
          ["organizationContext", access_token],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                pendingInvitations: old.data.pendingInvitations.filter(
                  (inv) => inv.id !== invitationId
                ),
              },
            };
          }
        );
      }

      // Optimistically update invitations query if it exists
      if (invitationId && previousInvitations) {
        queryClient.setQueryData(
          ["workspaces", "invitations"],
          (old: unknown) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (inv: { id?: string }) => inv.id !== invitationId
            );
          }
        );
      }

      // Return context with snapshot values for rollback
      return { previousOrgContext, previousInvitations };
    },
    onError: (error: Error, _params, context) => {
      // Rollback optimistic updates on error
      if (context?.previousOrgContext) {
        queryClient.setQueryData(
          ["organizationContext", access_token],
          context.previousOrgContext
        );
      }
      if (context?.previousInvitations) {
        queryClient.setQueryData(
          ["workspaces", "invitations"],
          context.previousInvitations
        );
      }

      toastUtils.generic.error(
        "Error accepting invitation",
        error.message || "Something went wrong. Please try again."
      );
    },
    onSuccess: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["workspaces", "invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizationContext", access_token],
      });
    },
    onSettled: () => {
      // Always refetch after mutation settles to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["workspaces", "invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizationContext", access_token],
      });
    },
  });
}

export function useDeleteInvitation(workspaceId: string) {
  const queryClient = useQueryClient();
  const access_token = getAuthToken();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const res = await fetch(ROUTES.INVITATION_DELETE(invitationId), {
        method: "DELETE",
        headers: {
          access_token: access_token || "",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onMutate: async (invitationId) => {
      await queryClient.cancelQueries({
        queryKey: ["workspaces", workspaceId],
      });

      const previousWorkspaceMembers =
        queryClient.getQueryData<WorkspacesMemberResponse>([
          "workspaces",
          workspaceId,
        ]);

      if (previousWorkspaceMembers) {
        queryClient.setQueryData<WorkspacesMemberResponse>(
          ["workspaces", workspaceId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                invitations: old.data.invitations.filter(
                  (invitation) => invitation.id !== invitationId
                ),
              },
            };
          }
        );
      }

      return { previousWorkspaceMembers };
    },
    onSuccess: (data) => {
      toastUtils.generic.success(
        data?.data?.message || "Invitation deleted successfully"
      );
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousWorkspaceMembers) {
        queryClient.setQueryData(
          ["workspaces", workspaceId],
          context.previousWorkspaceMembers
        );
      }
      toastUtils.generic.error(
        "Error deleting invitation",
        error.message || "Something went wrong. Please try again."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId],
      });
    },
  });
}

export function useResendInvitation(workspaceId: string) {
  const queryClient = useQueryClient();
  const access_token = getAuthToken();

  return useMutation({
    mutationFn: async (payload: ResendInvitationData) => {
      const res = await fetch(ROUTES.INVITATION_RESEND, {
        method: "POST",
        headers: {
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return responseData;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: ["workspaces", workspaceId],
      });

      const previousWorkspaceMembers =
        queryClient.getQueryData<WorkspacesMemberResponse>([
          "workspaces",
          workspaceId,
        ]);

      const optimisticUpdatedAt = new Date().toISOString();

      if (previousWorkspaceMembers) {
        queryClient.setQueryData<WorkspacesMemberResponse>(
          ["workspaces", workspaceId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                invitations: old.data.invitations.map((invitation) =>
                  invitation.id === payload.invitationId
                    ? {
                        ...invitation,
                        status: "Resending....",
                        updatedAt: optimisticUpdatedAt,
                      }
                    : invitation
                ),
              },
            };
          }
        );
      }

      return { previousWorkspaceMembers };
    },
    onSuccess: () => {
      toastUtils.generic.success("Invitation resent successfully");
    },
    onError: (error: Error, _payload, context) => {
      if (context?.previousWorkspaceMembers) {
        queryClient.setQueryData(
          ["workspaces", workspaceId],
          context.previousWorkspaceMembers
        );
      }
      toastUtils.generic.error(
        "Error resending invitation",
        error.message || "Something went wrong. Please try again."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId],
      });
    },
  });
}
