import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5588/api/v1";

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
  return useQuery({
    queryKey: ["orgSettings"],
    queryFn: async (): Promise<OrgSettings> => {
      const accessToken = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");

      if (!accessToken || !tenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(`${API_BASE_URL}/orgs/settings`, {
        method: "GET",
        headers: {
          accept: "*/*",
          "x-tenant-id": tenantId,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch org settings: ${response.statusText}`);
      }

      const data: OrgSettingsResponse = await response.json();
      return data.data;
    },
    enabled: false, // Disable auto-fetch, will be manually triggered when needed
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

      const response = await fetch(`${API_BASE_URL}/orgs/settings/systemPrompt`, {
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
      // Invalidate and refetch org settings
      queryClient.invalidateQueries({ queryKey: ["orgSettings"] });
      toast.success("System prompt updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update system prompt: ${error.message}`);
    },
  });
};
