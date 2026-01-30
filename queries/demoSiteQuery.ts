import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";
import {
  getBankApiKey,
  enrichOrganizationsWithApiKeys,
  enrichBanksWithApiKeys,
} from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WorkspacesResponse } from "./workspaceQuery";
import { WorkspaceSettingsResponse } from "./workspaceSettingQuery";
import { BANK_CONFIGS } from "@/constants/chatbot-demo-bank";

export function useDocsQuery(workspaceSlug?: string) {
  return useQuery({
    queryKey: ["documents", workspaceSlug],
    queryFn: async () => {
      const apiKey = getBankApiKey("NABIL");
      const res = await fetch(ROUTES.DOCUMENTS, {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug || "",
          "x-api-key": apiKey || "",
          accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        // Handle API error responses properly
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
  });
}
export function useEmbeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const workspaceId = workspaceSlug;
      const apiKey = getBankApiKey("NABIL");
      const res = await fetch(ROUTES.EMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceId || "",
          "x-api-key": apiKey || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // API returns error message in 'message' field
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to train document (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      toastUtils.generic.success(data?.data?.status, data?.data?.message);
      // Invalidate documents query to refetch the list and update status
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}
export function useUnembeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const apiKey = getBankApiKey("NABIL");
      const res = await fetch(ROUTES.UNEMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
          "x-api-key": apiKey || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // API returns error message in 'message' field
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to unembed document (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toastUtils.generic.success(data?.data?.status, data?.data?.message);
      // Invalidate documents query to refetch the list and update status
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}
export function useWorkspaceQuery() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<WorkspacesResponse> => {
      const apiKey = getBankApiKey("NABIL");
      const res = await fetch(`${ROUTES.MY_WORKSPACE}`, {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
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
    staleTime: 2 * 60 * 1000,
  });
}
// export function useWorkspaceSettingQuery(workspaceSlug: string) {
//   return useQuery({
//     queryKey: ["workspaceSettings", workspaceSlug],
//     enabled: !!workspaceSlug,
//     queryFn: async (): Promise<WorkspaceSettingsResponse> => {
//       const apiKey = getApiKey();
//       const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": apiKey || "",
//           "x-tenant-id": workspaceSlug,
//           accept: "application/json",
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         const errorMessage =
//           data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
//         throw new Error(errorMessage);
//       }
//       return data;
//     },
//   });
// }
export async function sendWidgetChatQuery(
  query: string,
  apiKey: string,
  workspaceId: string,
): Promise<{ answer: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(ROUTES.QUERY_WITH_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": workspaceId,
        "x-api-key": apiKey,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
      mode: "cors",
      credentials: "omit",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      answer: data.answer || data.data?.answer || "No response received",
    };
  } catch (error) {
    console.error("Fetch error details:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout: The server took too long to respond.",
        );
      }
      if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
        throw new Error(
          "Request blocked: Please disable ad blockers or try a different browser.",
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Network error: Unable to connect to the API server. Please check if the server is running and accessible.",
        );
      }
    }
    throw error;
  }
}
export function useChangeBotNameMutation(
  apiKey: string,
  workspaceSlug: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (botName: string) => {
      const res = await fetch(ROUTES.BOT_NAME, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
          "x-api-key": apiKey || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botName: botName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // API returns error message in 'message' field
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to change bot name (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toastUtils.generic.success(data?.data?.status, data?.data?.message);
      // Invalidate workspace query to refetch the updated bot name
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onSuccess?.();
    },
  });
}
export function useOrgBySectorQuery(sector: string) {
  return useQuery({
    queryKey: ["organizationsBySector", sector],
    queryFn: async () => {
      // Use first available API key for the request (or get from first org if available)
      const apiKey = getBankApiKey("NABIL");
      const res = await fetch(`${ROUTES.ORG_BY_SECTOR(sector)}`, {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
          accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        // Handle API error responses properly
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      // Enrich organizations with API keys from ENV and hardcoded bank config
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        // Define banks with hardcoded quickQuestions and primaryColor
        const banksData = [
          {
            name: "NABIL",
            quickQuestions: [
              "What is the capital of Nepal?",
              "What is the population of Nepal?",
            ],
            primaryColor: "#fefefe",
          },
        ];

        // Enrich organizations: adds API keys from ENV and bank config to matching workspaces
        const enrichedData = enrichOrganizationsWithApiKeys(
          data.data,
          BANK_CONFIGS,
        );

        console.log("enriched data ==>", enrichedData);

        return {
          ...data,
          data: enrichedData,
        };
      }

      return data;
    },
  });
}
