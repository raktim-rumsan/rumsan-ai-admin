import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  isPersonal: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface TenantData {
  personal: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    isPersonal: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  teams: Team[];
}

interface TenantResponse {
  data: TenantData;
}

export function useTenantQuery() {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: async (): Promise<TenantResponse> => {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error("No auth token found");
      }
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API!;
      const response = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/orgs/my-workspaces`, {
        method: "GET",
        headers: {
          accept: "*/*",
          access_token: authToken, // authToken already includes 'base64-' prefix
        },
      });
      if (!response.ok) {
        console.error("Tenant API error:", response.status, response.statusText);
        throw new Error(`Failed to fetch tenant data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    },
    enabled: typeof window !== "undefined", // Always try to run on client side
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message?.includes("auth")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
