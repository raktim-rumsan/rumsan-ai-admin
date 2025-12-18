import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";

export interface OAuthInstallResponse {
  installUrl: string;
}

export interface SlackWorkspaceResponse {
  teamId: string;
  teamName?: string;
  installedAt?: string;
  status: boolean;
}

export interface ToggleWorkspaceResponse {
  status: boolean;
  message: string;
}

// Initiate Slack OAuth installation
export function useSlackOAuthInstall(workspaceSlug?: string) {
  return useMutation({
    mutationFn: async (workspaceId?: string): Promise<OAuthInstallResponse> => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(ROUTES.SLACK_OAUTH_INSTALL(workspaceId), {
        method: "GET",
        headers: {
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
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
    onSuccess: (data) => {
      if (data.installUrl) {
        //Handle redirect to install url here
      } else {
        throw new Error(
          'Response missing installUrl. Expected format: { "installUrl": "https://slack.com/..." }'
        );
      }
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Failed to initiate Slack integration",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

export type SlackChannel = {
  id: string;
  created: number;
  creator: string;
  is_org_shared: boolean;
  is_im: boolean;
  context_team_id: string;
  updated: number;
  name: string;
  name_normalized: string;
  is_channel: boolean;
  is_group: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;
  is_shared: boolean;
  is_ext_shared: boolean;
  unlinked: number;
  is_pending_ext_shared: boolean;
  pending_shared: unknown[];
  parent_conversation: string | null;

  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };

  topic: {
    value: string;
    creator: string;
    last_set: number;
  };

  shared_team_ids: string[];
  pending_connected_team_ids: string[];
  is_member: boolean;
  num_members: number;

  properties: {
    use_case?: string;
    tabs?: {
      id: string;
      type: string;
      label?: string;
      data: {
        file_id: string;
        shared_ts: string;
      };
    }[];
    tabz?: {
      id: string;
      type: string;
      data: {
        file_id: string;
        shared_ts: string;
      };
    }[];
  };

  previous_names: string[];
};

// Get Slack workspace by internal workspace ID or slug
export function useSlackWorkspaceByIdentifier(
  workspaceId: string,
  workspaceSlug?: string
) {
  console.log("workspaceId", workspaceId);
  return useQuery({
    queryKey: ["slack", "workspace", workspaceId, workspaceSlug],
    queryFn: async (): Promise<SlackWorkspaceResponse> => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(
        ROUTES.SLACK_WORKSPACE_BY_IDENTIFIER(workspaceId),
        {
          method: "GET",
          headers: {
            access_token: access_token || "",
            "x-tenant-id": workspaceSlug || "",
            accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get channels for a Slack workspace
export function useSlackChannels(workspaceId: string, workspaceSlug?: string) {
  return useQuery({
    queryKey: ["slack", "channels", workspaceId, workspaceSlug],
    queryFn: async (): Promise<SlackChannel[] | undefined> => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(ROUTES.SLACK_CHANNELS(workspaceId), {
        method: "GET",
        headers: {
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
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
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}

// Install bot to a channel(connect/install)
export function useInstallSlackChannel(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      channelId,
    }: {
      workspaceId: string;
      channelId: string;
    }) => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(
        ROUTES.SLACK_INSTALL_CHANNEL(workspaceId, channelId),
        {
          method: "POST",
          headers: {
            access_token: access_token || "",
            "x-tenant-id": workspaceSlug || "",
            accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate channels query to refetch updated channel status
      queryClient.invalidateQueries({
        queryKey: ["slack", "channels", variables.workspaceId],
      });
      toastUtils.generic.success(
        "Channel installed",
        "Bot has been added to the channel successfully"
      );
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Failed to install channel",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

// Uninstall bot from a channel (muilti select uninstall)
export function useUninstallSlackChannel(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      channelId,
    }: {
      workspaceId: string;
      channelId: string;
    }) => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(
        ROUTES.SLACK_UNINSTALL_CHANNEL(workspaceId, channelId),
        {
          method: "POST",
          headers: {
            access_token: access_token || "",
            "x-tenant-id": workspaceSlug || "",
            accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["slack", "channels", variables.workspaceId],
      });
      toastUtils.generic.success(
        "Channel uninstalled",
        "Bot has been removed from the channel successfully"
      );
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Failed to uninstall channel",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

// Toggle Slack workspace status (active/inactive)
export function useToggleSlackWorkspace(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      workspaceId: string
    ): Promise<ToggleWorkspaceResponse> => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(ROUTES.SLACK_TOGGLE_WORKSPACE(workspaceId), {
        method: "PATCH",
        headers: {
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
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
    onSuccess: (_, workspaceId) => {
      // Invalidate workspace query to refetch updated status
      queryClient.invalidateQueries({
        queryKey: ["slack", "workspace"],
      });
      toastUtils.generic.success(
        "Workspace status updated",
        "Slack workspace status has been toggled successfully"
      );
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Failed to toggle workspace status",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

// Uninstall workspace (remove bot from all channels and disconnect)
export function useUninstallSlackWorkspace(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const access_token = getAuthToken();

      if (!access_token) {
        throw new Error("Missing authentication credentials");
      }

      const res = await fetch(ROUTES.SLACK_UNINSTALL_WORKSPACE(workspaceId), {
        method: "DELETE",
        headers: {
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
          accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return { data, workspaceId, workspaceSlug };
    },
    onSuccess: (data, variables) => {
      console.log(data, variables, "data");
      queryClient.invalidateQueries({
        queryKey: ["slack", "workspace", data.workspaceId, data.workspaceSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["slack", "channels", data.workspaceId, data.workspaceSlug],
      });
      toastUtils.generic.success(
        "Workspace uninstalled",
        "Slack workspace has been disconnected successfully"
      );
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Failed to uninstall workspace",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}
