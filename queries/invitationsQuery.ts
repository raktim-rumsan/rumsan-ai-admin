import { ROUTES } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";

// export type AcceptInvitationPayload = {
//   token: string;
// };

// export function useAcceptInvitation() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (invitationData: AcceptInvitationPayload) => {
//       const access_token = getAuthToken();
//       const workspaceId = localStorage.getItem("workspaceId");
//       const res = await fetch(ROUTES.INVITATION_ACCEPT, {
//         method: "POST",
//         headers: {
//           "x-tenant-id": workspaceId || "",
//           access_token: access_token || "",
//           "Content-Type": "application/json",
//           accept: "application/json",
//         },
//         body: JSON.stringify(invitationData),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         const errorMessage =
//           data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
//         throw new Error(errorMessage);
//       }
//       return data;
//     },
//     onSuccess: () => {
//       toastUtils.success("Invitation accepted successfully");
//       queryClient.invalidateQueries(["invitations"]);
//     },
//   });
// }

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
