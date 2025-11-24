import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { z } from "zod";

import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";

export function useOrganizationQuery() {
  const workspaceId = localStorage.getItem("workspaceId");
  return useQuery({
    queryKey: ["organizations", workspaceId],
    queryFn: async () => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.ORGANIZATIONS, {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceId || "",
          access_token: access_token || "",
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

export function useOrganizationById() {
  const workspaceId = localStorage.getItem("workspaceId");
  const orgId = localStorage.getItem("orgId") || "";
  return useQuery({
    queryKey: ["organizations", workspaceId, orgId],
    queryFn: async () => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.ORGANIZATION_ID(orgId), {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceId || "",
          access_token: access_token || "",
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



export function useOrganizationMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organizationData: {
      name: string;
      slug?: string;
      sector?: string;
    }) => {
      const access_token = getAuthToken();
      const workspaceId = localStorage.getItem("workspaceId");
      const res = await fetch(ROUTES.ORGANIZATIONS, {
        method: "POST",
        headers: {
          "x-tenant-id": workspaceId || "",
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
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
    onSuccess: (data) => {
      const { data: orgData } = data;
      // Invalidate organizations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      // Also invalidate organization context to update user state and redirectTo
      queryClient.invalidateQueries({ queryKey: ["organizationContext"] });
      toastUtils.generic.success(
        "Organization created!",
        `${orgData.name || "Organization"} has been successfully created.`
      );
      localStorage.setItem("orgId", orgData.id);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error creating organization",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

export function useOrganizationMutationUpdate(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const orgId = localStorage.getItem("orgId") || "";

  return useMutation({
    mutationFn: async (organizationData: {
      name: string;
      sector?: string;
    }) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.ORGANIZATION_UPDATE(orgId), {
        method: "PATCH",
        headers: {
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
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
    onSuccess: (data) => {
      const { data: orgData } = data;
      // Invalidate organizations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      // Also invalidate organization context to update user state and redirectTo
      queryClient.invalidateQueries({ queryKey: ["organizationContext"] });
      toastUtils.generic.success(
        "Organization updated!",
        `${orgData.name || "Organization"} has been successfully updated.`
      );
      onSuccess?.();
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error updating organization",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

// Zod schema for organization context response validation
const OrganizationContextSchema = z.object({
  data: z.object({
    redirectTo: z.string(),
    userState: z.string(),
    message: z.string(),
    organizations: z.object({
      primary: z
        .object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          role: z.string(),
          isOwner: z.boolean(),
          joinedAt: z.string(),
          workspacesCount: z.number(),
          membersCount: z.number(),
        })
        .optional(),
      all: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          role: z.string(),
          isOwner: z.boolean(),
          joinedAt: z.string(),
        })
      ),
    }),
    workspaces: z.object({
      accessible: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          description: z.string(),
          role: z.string(),
          organization: z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
          }),
          joinedAt: z.string(),
          isActive: z.boolean(),
        })
      ),
      totalCount: z.number(),
    }),
    pendingInvitations: z.array(
      z.object({
        id: z.string(),
        email: z.string(),
        role: z.string(),
        organizationId: z.string(),
        workspaceId: z.string().optional(),
        invitedAt: z.string(),
      })
    ),
  }),
});

export type OrganizationContextResponse = z.infer<
  typeof OrganizationContextSchema
>;

// Export the schema for use in other parts of the application
export { OrganizationContextSchema };

export function useOrganizationContextQuery(accessToken: string) {
  return useQuery({
    queryKey: ["organizationContext"],
    queryFn: async (): Promise<OrganizationContextResponse> => {
      const res = await fetch(ROUTES.ORGANIZATION_CONTEXT, {
        method: "GET",
        headers: {
          access_token: accessToken,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();
      return OrganizationContextSchema.parse(data);
    },
    retry: false,
    enabled: !!accessToken,
  });
}
