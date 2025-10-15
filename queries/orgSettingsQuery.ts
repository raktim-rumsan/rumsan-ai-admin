import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toast } from "sonner";

import API_BASE_URL from "@/constants";

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
  const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

  return useQuery({
    queryKey: ["orgSettings", tenantId],
    queryFn: async (): Promise<OrgSettings> => {
      const accessToken = getAuthToken();
      const currentTenantId = localStorage.getItem("tenantId");

      if (!accessToken || !currentTenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(`${API_BASE_URL}/workspaces/settings`, {
        method: "GET",
        headers: {
          accept: "*/*",
          "x-tenant-id": currentTenantId,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch org settings: ${response.statusText}`);
      }

      const data: OrgSettingsResponse = await response.json();
      return data.data;
    },
    enabled: typeof window !== "undefined" && !!tenantId, // Only run on client-side when tenantId exists
  });
};

// Update system prompt
export const useUpdateSystemPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSystemPromptPayload): Promise<void> => {
      const accessToken = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");

      if (!accessToken || !tenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(`${API_BASE_URL}/workspaces/settings/systemPrompt`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "x-tenant-id": tenantId,
          access_token: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update system prompt: ${response.statusText}`);
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
