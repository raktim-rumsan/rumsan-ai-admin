import { ROUTES } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantId } from "@/stores/tenantStore";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";

export interface Workspace {
  id: string;
  orgId: string | null;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  isPersonal: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacesResponse {
  data: Workspace[];
}
export function useWorkspaceQuery() {
  const tenantId = useTenantId();
  console.log("tenantId:", tenantId);
  return useQuery({
    queryKey: ["workspaces", tenantId],
    queryFn: async (): Promise<WorkspacesResponse> => {
      const tenantId = localStorage.getItem("tenantId");
      const orgId = localStorage.getItem("orgId");
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.ORG_WORKSPACE}/${orgId}/workspaces`, {
        method: "GET",
        headers: {
          "x-tenant-id": tenantId || "",
          access_token: access_token || "",
          accept: "application/json",
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
  });
}
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceData: {
      name: string;
      description?: string;
    }) => {
      const access_token = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");
      const res = await fetch(ROUTES.ADMIN_WORKSPACE, {
        method: "POST",
        headers: {
          "x-tenant-id": tenantId || "",
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
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
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error creating workspace",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}
