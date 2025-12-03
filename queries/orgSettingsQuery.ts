import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toast } from "sonner";

import { ROUTES } from "@/constants";

export interface OrgSettings {
  systemPrompt?: string;
  temperature?: number;
  maxTokensPerQuery?: number;
  llmModel?: string;
  embeddingModel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrgSettingsResponse {
  data: OrgSettings;
}

export interface UpdateSystemPromptPayload {
  systemPrompt: string;
}

// Get organization settings
export const useOrgSettings = () => {
  const workspaceId =
    typeof window !== "undefined" ? localStorage.getItem("workspaceId") : null;

  return useQuery({
    queryKey: ["orgSettings", workspaceId],
    queryFn: async (): Promise<OrgSettings> => {
      const accessToken = getAuthToken();
      if (!accessToken || !workspaceId) {
        throw new Error("Missing authentication credentials");
      }
      const response = await fetch(ROUTES.WORKSPACE_SETTING, {
        method: "GET",
        headers: {
          accept: "*/*",
          "x-tenant-id": workspaceId,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch org settings: ${response.statusText}`);
      }

      const data: OrgSettingsResponse = await response.json();
      return data.data;
    },
    enabled: typeof window !== "undefined" && !!workspaceId, // Only run on client-side when workspaceId exists
  });
};

// Update system prompt
export const useUpdateSystemPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSystemPromptPayload): Promise<void> => {
      const accessToken = getAuthToken();
      const workspaceId =
        typeof window !== "undefined"
          ? localStorage.getItem("workspaceId")
          : null;
      if (!accessToken || !workspaceId) {
        throw new Error("Missing authentication credentials");
      }
      const response = await fetch(ROUTES.SETTING_SYSTEM_PROMT, {
        method: "POST",
        headers: {
          accept: "*/*",
          "x-tenant-id": workspaceId,
          access_token: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update system prompt: ${response.statusText}`
        );
      }
    },
    onSuccess: () => {
      // Invalidate and refetch org settings for all tenants
      queryClient.invalidateQueries({ queryKey: ["orgSettings"] });
      toast.success("System prompt updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update system prompt: ${error.message}`);
    },
  });
};
