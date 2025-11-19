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
    // 🔥 Optimistic update here
    onMutate: async (newData: Partial<WorkspaceSettings>) => {
      await queryClient.cancelQueries({ queryKey: ["workspaceSettings"] });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData<WorkspaceSettings>([
        "workspaceSettings",
      ]);

      // Optimistically update cache
      queryClient.setQueryData<WorkspaceSettings>(
        ["workspaceSettings"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...newData,
          };
        }
      );

      return { previousSettings };
    },

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

    // ❌ If the mutation fails → rollback optimistic update
    onError: (err, variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          ["workspaceSettings"],
          context.previousSettings
        );
      }
      toast.error(err.message);
    },

    // 🟢 Success → refetch & show toast
    onSuccess: () => {
      toast.success("Workspace settings updated successfully");
    },

    // Always run after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceSettings"] });
    },
  });
}
