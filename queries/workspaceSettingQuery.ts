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
  provider: string;
  apiKey?: string;
}

export interface WorkspaceSettingsResponse {
  data: WorkspaceSettings;
}

export function useWorkspaceSettingQuery(workspaceSlug?: string) {
  return useQuery({
    queryKey: ["workspaceSettings", workspaceSlug],
    enabled: !!workspaceSlug,
    queryFn: async (): Promise<WorkspaceSettingsResponse> => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
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
export function useUpdateWorkspaceSetting(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<WorkspaceSettings>) => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    },
    // Optimistic update here
    onMutate: async (newData: Partial<WorkspaceSettings>) => {
      await queryClient.cancelQueries({
        queryKey: ["workspaceSettings", workspaceSlug],
      });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData<WorkspaceSettings>([
        "workspaceSettings",
        workspaceSlug,
      ]);

      // Optimistically update cache
      queryClient.setQueryData(["workspaceSettings", workspaceSlug], newData);

      return { previousSettings, newData };
    },

    // If the mutation fails → rollback optimistic update
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        ["workspaceSettings", workspaceSlug],
        context?.previousSettings
      );
      toast.error(err.message);
    },

    // Success → refetch & show toast
    onSuccess: () => {
      toast.success("Workspace settings updated successfully");
    },

    // Always run after error or success
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceSettings", workspaceSlug],
      });
    },
  });
}
export function useTestConnection() {
  return useMutation({
    mutationFn: async ({ apiKey }: { apiKey: string }) => {
      const res = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Connection test failed");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Connection successful!");
    },
    onError: () => {
      toast.error("Connection test failed");
    },
  });
}
