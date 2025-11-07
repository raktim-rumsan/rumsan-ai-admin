import { ROUTES } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";

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
    mutationFn: async (token: string) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", "invitations"],
      });
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error accepting invitation",
        error.message || "Something went wrong. Please try again."
      );
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId],
      });
      toastUtils.generic.success("Member removed successfully");
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error deleting invitation",
        error.message || "Something went wrong. Please try again."
      );
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId],
      });
      toastUtils.generic.success("Invitation resent successfully");
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error resending invitation",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}
