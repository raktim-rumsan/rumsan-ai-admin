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
export const useOrgSettings = (workspaceSlug?: string) => {
  return useQuery({
    queryKey: ["orgSettings", workspaceSlug],
    queryFn: async (): Promise<OrgSettings> => {
      const accessToken = getAuthToken();
      if (!accessToken || !workspaceSlug) {
        throw new Error("Missing authentication credentials");
      }
      const response = await fetch(ROUTES.WORKSPACE_SETTING, {
        method: "GET",
        headers: {
          accept: "*/*",
          "x-tenant-id": workspaceSlug,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch org settings: ${response.statusText}`);
      }

      const data: OrgSettingsResponse = await response.json();
      return data.data;
    },
    enabled: !!workspaceSlug, // Only run when workspaceSlug exists
  });
};

// Update system prompt
export const useUpdateSystemPrompt = (workspaceSlug?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSystemPromptPayload): Promise<void> => {
      const accessToken = getAuthToken();
      if (!accessToken || !workspaceSlug) {
        throw new Error("Missing authentication credentials");
      }
      const response = await fetch(ROUTES.SETTING_SYSTEM_PROMT, {
        method: "POST",
        headers: {
          accept: "*/*",
          "x-tenant-id": workspaceSlug,
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
