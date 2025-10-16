import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { useTenantId } from "@/stores/tenantStore";

import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";

export function useOrganizationQuery() {
  const tenantId = useTenantId();

  return useQuery({
    queryKey: ["organizations", tenantId],
    queryFn: async () => {
      const tenantId = localStorage.getItem("tenantId");
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.ORGANIZATIONS, {
        method: "GET",
        headers: {
          "x-tenant-id": tenantId || "",
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
    mutationFn: async (organizationData: { name: string; slug?: string }) => {
      const access_token = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");
      const res = await fetch(ROUTES.ORGANIZATIONS, {
        method: "POST",
        headers: {
          "x-tenant-id": tenantId || "",
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
      console.log("data:", orgData);
      // Invalidate organizations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
