import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";


export function useAddOrgUserMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }: {
      
      email: string;
      role: string;
    }) => {
      const access_token = getAuthToken();
      const tenantId = localStorage.getItem("tenantId");
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API!;
      const res = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/orgs/users`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": tenantId || "",
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add user");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onSuccess?.();
    },
  });
}