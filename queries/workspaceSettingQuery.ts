import { ROUTES } from "@/constants";
import { getAuthToken } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useWorkspaceSettingQuery() {
  const workspaceId = localStorage.getItem("workspaceId");
  //   const workspaceId = "rumsan-workspace-1762766064116";

  return useQuery({
    queryKey: ["workspaceSettings"],
    queryFn: async (): Promise<any> => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WORKSPACE_SETTING}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceId || "",
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
  });
}
export function useUpdateWorkspaceSetting() {
  const workspaceId = localStorage.getItem("workspaceId");
  //   const workspaceId = "rumsan-workspace-1762766064116";

  return async (settingsData: any) => {
    const access_token = getAuthToken();
    const res = await fetch(ROUTES.WORKSPACE_SETTING, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        access_token: access_token || "",
        "x-tenant-id": workspaceId || "",
        accept: "application/json",
      },
      body: JSON.stringify(settingsData),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage =
        data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }
    return data;
  };
}
