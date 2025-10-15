import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/constants";

interface Team {
  id: string;
  orgId: string | null;
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
    orgId: string | null;
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
      const response = await fetch(ROUTES.MY_WORKSPACE, {
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

export function useTenantWithOnboarding() {
  const router = useRouter();
  const tenantQuery = useTenantQuery();

  useEffect(() => {
    if (tenantQuery.data?.data) {
      let hasValidOrgId = false;

      // First check personal workspace
      if (tenantQuery.data.data.personal && tenantQuery.data.data.personal.orgId !== null) {
        hasValidOrgId = true;
      }

      // If no personal workspace or personal workspace has no orgId, check teams
      if (!hasValidOrgId) {
        hasValidOrgId = tenantQuery.data.data.teams.some((team) => team.orgId !== null);
      }

      // If no valid orgId found anywhere, redirect to onboarding
      if (!hasValidOrgId) {
        router.push("/onboarding");
      }
    }
  }, [tenantQuery.data, router]);

  return tenantQuery;
}

interface CreateOrgPayload {
  name: string;
  description: string;
}

interface CreateOrgOptions {
  onSuccess?: (data: unknown) => void;
}

export function useCreateOrgMutation(options?: CreateOrgOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrgPayload) => {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error("No auth token found");
      }
      const response = await fetch(ROUTES.CREATE_WORKSPACE, {
        method: "POST",
        headers: {
          accept: "*/*",
          access_token: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create organization: ${response.statusText}`
        );
      }

      return response.json();
    },
    onSuccess: async (data) => {
      toast.success("Workspace created successfully!");
      // Call custom onSuccess if provided
      options?.onSuccess?.(data);
      // Refetch tenant data to show the new team - do this after custom onSuccess
      await queryClient.refetchQueries({ queryKey: ["tenant"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create team");
    },
  });
}
