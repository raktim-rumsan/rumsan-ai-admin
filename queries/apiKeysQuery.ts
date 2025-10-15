import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toast } from "sonner";

import { ROUTES } from "@/constants";

export interface ApiKey {
  id?: string;
  name: string;
  apiKey: string; // From API response
  key: string; // For UI compatibility - always set in transformation
  createdAt: string;
  lastUsedAt: string | null;
  createdBy: string;
  created?: string; // For backwards compatibility in display
}

export interface ApiKeysResponse {
  data: ApiKey[];
}

export interface CreateApiKeyPayload {
  name: string;
}

export interface CreateApiKeyResponse {
  data: ApiKey;
}

// Get organization API keys
export const useApiKeys = () => {
  const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

  return useQuery({
    queryKey: ["apiKeys", tenantId],
    queryFn: async (): Promise<ApiKey[]> => {
      const accessToken = getAuthToken();
      const currentTenantId = localStorage.getItem("tenantId");

      if (!accessToken || !currentTenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(ROUTES.ORG_API_KEYS, {
        method: "GET",
        headers: {
          accept: "*/*",
          "x-tenant-id": currentTenantId,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch API keys: ${response.statusText}`);
      }

      const data: ApiKeysResponse = await response.json();

      // Transform the data to add formatted dates and generate IDs for table rendering
      const transformedData = (data.data || []).map((item, index) => ({
        ...item,
        id: item.id || item.name || `api-key-${index}`, // Use name as fallback ID if no ID provided
        key: item.apiKey, // Map apiKey from response to key for UI compatibility
        created: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));

      return transformedData;
    },
    enabled: typeof window !== "undefined" && !!tenantId, // Only run on client-side when tenantId exists
  });
};

// Create organization API key
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateApiKeyPayload): Promise<ApiKey> => {
      const accessToken = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");

      if (!accessToken || !tenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(ROUTES.CREATE_ORG_API_KEY, {
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || response.statusText;
        throw new Error(`Failed to create API key: ${errorMessage}`);
      }

      const data: CreateApiKeyResponse = await response.json();

      // Transform the created API key to match our UI interface
      const transformedApiKey = {
        ...data.data,
        key: data.data.apiKey, // Map apiKey to key for UI compatibility
        created: new Date(data.data.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      return transformedApiKey;
    },
    onSuccess: () => {
      // Invalidate and refetch API keys for all tenants
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create API key: ${error.message}`);
    },
  });
};

// Delete organization API key
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (apiKeyId: string): Promise<void> => {
      const accessToken = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");

      if (!accessToken || !tenantId) {
        throw new Error("Missing authentication credentials");
      }

      const response = await fetch(ROUTES.DELETE_ORG_API_KEY(apiKeyId), {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "x-tenant-id": tenantId,
          access_token: accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || response.statusText;
        throw new Error(`Failed to delete API key: ${errorMessage}`);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch API keys for all tenants
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete API key: ${error.message}`);
    },
  });
};
