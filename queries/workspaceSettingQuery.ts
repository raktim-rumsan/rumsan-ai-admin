import { ROUTES } from "@/constants";
import { getAuthToken } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export interface WorkspaceSettings {
  id: string;
  systemPrompt: string;
  temperature: number;
  maxTokensPerQuery: number;
  llmModel: string;
  embeddingModel: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettingsResponse {
  data: WorkspaceSettings;
}

export function useWorkspaceSettingQuery() {
  const workspaceId = localStorage.getItem("workspaceId");

  return useQuery({
    queryKey: ["workspaceSettings"],
    queryFn: async (): Promise<WorkspaceSettingsResponse> => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceId || "",
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
export function useUpdateWorkspaceSetting() {
  const queryClient = useQueryClient();
  const workspaceId = localStorage.getItem("workspaceId");

  return useMutation({
    mutationFn: async (payload: Partial<WorkspaceSettings>) => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceId || "",
          accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
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
      queryClient.invalidateQueries({ queryKey: ["workspaceSettings"] });
      toast.success("Workspace settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
