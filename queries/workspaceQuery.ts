import { ROUTES } from "@/constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";
import { McpServer, WorkspaceMcpServer } from "@/types/ai";

export interface Workspace {
  id: string;
  orgId: string | null;
  name: string;
  slug: string;
  description: string | null;
  sector: string | null;
  botName: string | null;
  url: string | null;
  isActive: boolean;
  isPersonal: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
  userRole: string;
  organization?: {
    name: string;
    slug: string;
  };
}

export interface WorkspaceMember {
  id: string;
  user: {
    email: string;
    full_name: string;
  };
  role: string;
  joinedAt: string;
  isActive: boolean;
}

export interface WorkspaceInvitations {
  id?: string;
  email?: string;
  workspaceId?: string;
  role?: string;
  invitedBy?: {
    id?: string;
    email?: string;
    full_name?: string;
  };
  status?: string;
  expiresAt?: string;
  acceptedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateInvitationPayload = {
  email: string;
  role: string;
};
export interface UploadResponse {
  data: {
    url: string;
    message: string;
  };
}
export interface RemoveImageResponse {
  data: {
    message: string;
  };
}

export interface WorkspacesResponse {
  data: {
    myWorkspaces: Workspace[];
  };
}

export interface WorkspacesMemberResponse {
  data: {
    members: WorkspaceMember[];
    invitations: WorkspaceInvitations[];
  };
}

interface DeleteMemberPayload {
  workspaceId: string;
  email: string;
}

export interface McpServerToolsResponse {
  data: WorkspaceMcpServer[];
}

export interface McpTool {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  enabled: boolean;
}

export interface ToggleMcpToolPayload {
  toolId: string;
  payload: {
    enabled: boolean;
  };
  workspaceId: string;
}

export interface ToggleMcpToolResponse {
  data: {
    id: string;
    isActive: boolean;
    workspaceId?: string;
  };
}

export interface ToggleMcpServerPayload {
  workspaceId: string;
  serverId: string;
  isActive: boolean;
}

export interface ToggleMcpServerResponse {
  data: {
    id: string;
    isActive: boolean;
    workspaceId?: string;
  };
}

export interface CreateMcpServerPayload {
  mcpServerId: string;
  authentication: Record<string, string>;
}

export interface UpdateMcpServerPayload {
  serverId: string;
  authentication?: Record<string, string>;
  isActive?: boolean;
}

type DeleteMemberResponse = void; // since the API returns nothing on success

export function useWorkspaceQuery() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<WorkspacesResponse> => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.MY_WORKSPACE}`, {
        method: "GET",
        headers: {
          access_token: access_token || "",
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

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceData: {
      name: string;
      description?: string;
      sector?: string;
    }) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.CREATE_WORKSPACE, {
        method: "POST",
        headers: {
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error creating workspace",
        error.message || "Something went wrong. Please try again.",
      );
    },
  });
}

export function useUpdateWorkspace(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      payload: {
        name?: string;
        description?: string;
        sector?: string;
        botName?: string;
      };
    }) => {
      const access_token = getAuthToken();
      if (!access_token) throw new Error("Missing auth token");
      const res = await fetch(ROUTES.UPDATE_WORKSPACE(params.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
          "x-tenant-id": workspaceSlug || "",
        },
        body: JSON.stringify(params.payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || res.statusText);
      }

      return data;
    },

    // Optimistic update
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["workspaces"] });
      await queryClient.cancelQueries({ queryKey: ["workspaces", params.id] });

      // Snapshot previous value
      const previousWorkspaces = queryClient.getQueryData<Workspace>([
        "workspaces",
      ]);
      const previousWorkspace = queryClient.getQueryData<Workspace>([
        "workspaces",
        params.id,
      ]);

      // Optimistically update the workspace
      queryClient.setQueryData(
        ["workspaces", params.id],
        (old: { data?: Workspace }) => ({
          ...old,
          data: {
            ...old?.data,
            ...params.payload,
          },
        }),
      );

      queryClient.setQueryData(
        ["workspaces"],
        (old: { data: { myWorkspaces: Workspace[] } }) => {
          if (!old) return old;
          const updated = old.data?.myWorkspaces?.map((w) =>
            w.id === params.id ? { ...w, ...params.payload } : w,
          );
          return { ...old, data: { ...old.data, myWorkspaces: updated } };
        },
      );

      return { previousWorkspaces, previousWorkspace };
    },
    onSuccess: () => {
      toastUtils.generic.success("Workspace updated successfully");
    },

    onError: (
      err,
      _variables,
      context?: {
        previousWorkspaces?: Workspace;
        previousWorkspace?: Workspace;
      },
    ) => {
      toastUtils.generic.error(err.message || "Failed to update workspace");
      // Rollback cache
      if (context?.previousWorkspace) {
        queryClient.setQueryData(
          ["workspaces", context.previousWorkspace.id],
          context.previousWorkspace,
        );
      }
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", variables.id] });
    },
  });
}

export function useInvitationWorkspaceMutation(workspaceSlug?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInvitationPayload) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACEINVITE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token || "",
          accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceSlug],
      });
      toastUtils.invitations.sendSuccess(1);
    },
    onError: (error: Error) => {
      toastUtils.invitations.sendError(error.message);
    },
  });
}

export function useWorkspaceMemberQuery(workspaceSlug: string) {
  // Fetch workspace to get ID from slug
  const { data: workspaceData } = useWorkspaceQuery();
  const workspace = workspaceData?.data?.myWorkspaces?.find(
    (w) => w.slug === workspaceSlug,
  );
  const workspaceId = workspace?.id;

  return useQuery({
    queryKey: ["workspaces", workspaceSlug],
    staleTime: 10_000,
    refetchInterval: 10_000, // Automatically refetch every 5 seconds
    enabled: !!workspaceId, // Only run query if workspaceId is resolved
    queryFn: async (): Promise<WorkspacesMemberResponse> => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACE_MEMBER(workspaceId!), {
        method: "GET",
        headers: {
          access_token: access_token || "",
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

export function useImageUploadMutation(
  workspaceId: string,
  onSuccess?: () => void,
): UseMutationResult<UploadResponse, Error, File> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACE_IMAGE_UPLOAD(workspaceId), {
        method: "POST",
        body: formData,
        headers: {
          access_token: access_token!,
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
    onSuccess: () => {
      // Invalidate workspace query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onSuccess?.();
    },
  });
}

export function removeWorkspaceImage(
  onSuccess?: () => void,
): UseMutationResult<RemoveImageResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACE_IMAGE_REMOVE(workspaceId), {
        method: "DELETE",
        headers: {
          access_token: access_token || "",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Handle API error responses properly
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      // Return success response (might be empty for DELETE)
      const data = await res.json().catch(() => ({ success: true }));
      return data;
    },
    onSuccess: () => {
      // Invalidate workspace query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onSuccess?.();
    },
  });
}

export function useDeleteWorkspaceMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<DeleteMemberResponse, Error, DeleteMemberPayload>({
    mutationFn: async ({ workspaceId, email }) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACE_MEMBER_DELETE(workspaceId), {
        method: "DELETE",
        headers: {
          access_token: access_token || "",
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      return; // void
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", variables.workspaceId],
      });
      toastUtils.generic.success("Member removed successfully");
    },

    onError: (error) => {
      toastUtils.generic.error(
        "Error removing member",
        error.message || "Something went wrong. Please try again.",
      );
    },
  });
}

export function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (workspaceId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.DELETE_WORKSPACE(workspaceId), {
        method: "DELETE",
        headers: {
          access_token: access_token!,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      return; // void
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      toastUtils.generic.success("Workspace deleted successfully");
    },

    onError: (error) => {
      toastUtils.generic.error(
        "Error deleting workspace",
        error.message || "Something went wrong. Please try again.",
      );
    },
  });
}

export function useMcpServerQuery(workspaceId: string, workspaceSlug?: string) {
  return useQuery({
    queryKey: ["servers", workspaceId, "mcp-server-tools"],
    enabled: !!workspaceId,
    queryFn: async (): Promise<McpServerToolsResponse> => {
      const access_token = getAuthToken();

      const res = await fetch(ROUTES.MCP_SERVERS(workspaceId), {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug!,
          access_token: access_token!,
          "Content-Type": "application/json",
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

export function useAvailableMcpServerQuery(
  workspaceId: string,
  workspaceSlug?: string,
) {
  return useQuery({
    queryKey: ["available-servers", workspaceId, "mcp-server-tools"],
    enabled: !!workspaceId, // Only run query if workspaceId is provided
    queryFn: async (): Promise<McpServer[]> => {
      const access_token = getAuthToken();

      const res = await fetch(ROUTES.AVAILABLE_MCP_SERVER(workspaceId), {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug!,
          access_token: access_token!,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data.data as McpServer[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useToggleMcpToolsMutation(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<ToggleMcpToolResponse, Error, ToggleMcpToolPayload>({
    mutationFn: async ({
      workspaceId,
      toolId,
      payload,
    }: ToggleMcpToolPayload) => {
      const access_token = getAuthToken();
      if (!access_token) throw new Error("Missing auth token");
      if (!workspaceId) throw new Error("Missing workspace ID");

      const res = await fetch(
        ROUTES.MCP_SERVER_TOOL_TOGGLE(workspaceId, toolId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            access_token: access_token,
            "x-tenant-id": workspaceSlug,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },

    onMutate: async ({
      toolId,
      payload,
      workspaceId,
    }: ToggleMcpToolPayload) => {
      const queryKey = ["workspaces", workspaceId, "mcp-server-tools"];
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<McpServerToolsResponse>(queryKey);

      queryClient.setQueryData<McpServerToolsResponse>(queryKey, (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((server) => ({
            ...server,
            mcpTools: server.mcpServer.mcpTools?.map((tool) =>
              tool.id === toolId ? { ...tool, ...payload } : tool,
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (
      err: Error,
      _variables: ToggleMcpToolPayload,
      context?: { previousData?: McpServerToolsResponse },
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["servers", _variables.workspaceId, "mcp-server-tools"],
          context.previousData,
        );
      }
      const message =
        err instanceof Error ? err.message : "Failed to toggle MCP tool";
      toastUtils.generic.error(message);
    },

    onSettled: (
      data: ToggleMcpToolResponse | undefined,
      error: Error | null,
      variables: ToggleMcpToolPayload,
    ) => {
      const workspaceId = data?.data?.workspaceId || variables.workspaceId;
      queryClient.invalidateQueries({
        queryKey: ["servers", workspaceId, "mcp-server-tools"],
      });
    },

    onSuccess: (
      data: ToggleMcpToolResponse,
      variables: ToggleMcpToolPayload,
    ) => {
      const workspaceId = data?.data?.workspaceId || variables.workspaceId;
      queryClient.invalidateQueries({
        queryKey: ["servers", workspaceId, "mcp-server-tools"],
      });
      toastUtils.generic.success("MCP Tool toggled successfully");
    },
  });
}

//POST REQUEST TO SCRAPE A URL
export function useScrapeWebsiteMutation() {
  return useMutation({
    mutationFn: async (payload: { url: string }) => {
      // Use Next.js API route to proxy the request and avoid CORS issues
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
  });
}

export function useCreateMcpServerMutation(
  workspaceId: string,
  workspaceSlug: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMcpServerPayload) => {
      const access_token = getAuthToken();

      const res = await fetch(`${ROUTES.MCP_CREATE_SERVER(workspaceId!)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token!,
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      queryClient.invalidateQueries({ queryKey: ["available-servers"] });
      toastUtils.generic.success("MCP server added");
      onSuccess?.();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to add MCP server";
      toastUtils.generic.error(message);
    },
  });
}

export function useUpdateMcpServerMutation(
  workspaceId: string,
  workspaceSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateMcpServerPayload) => {
      const access_token = getAuthToken();
      const { serverId, ...body } = payload;
      const res = await fetch(
        `${ROUTES.MCP_UPDATE_SERVER(workspaceId!, serverId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": workspaceSlug!,
            access_token: access_token!,
            accept: "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      queryClient.invalidateQueries({ queryKey: ["available-servers"] });
      toastUtils.generic.success("MCP server updated");
    },
    onError: () => {
      toastUtils.generic.error(
        "Invalid credentials. Please check your authentication details.",
      );
    },
  });
}

export function useMCPDeleteMutation(
  workspaceId: string,
  workspaceSlug: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serverId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(
        `${ROUTES.MCP_DELETE_SERVER(workspaceId, serverId)}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            access_token: access_token!,
            "x-tenant-id": workspaceSlug,
          },
        },
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      queryClient.invalidateQueries({ queryKey: ["available-servers"] });
      toastUtils.generic.success("MCP server deleted"); // ✅ toast handled here
      onSuccess?.(); // optional callback from component
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete MCP server";
      toastUtils.generic.error(message); // ✅ toast handled here
    },
  });
}

export function useToggleMcpServerSwitchMutation(
  workspaceId: string,
  workspaceSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation<ToggleMcpServerResponse, Error, ToggleMcpServerPayload>({
    mutationFn: async ({
      workspaceId,
      serverId,
      isActive,
    }: ToggleMcpServerPayload) => {
      const access_token = getAuthToken();
      if (!access_token) throw new Error("Missing auth token");
      if (!workspaceId) throw new Error("Missing workspace ID");
      if (!serverId) throw new Error("Missing server ID");

      const res = await fetch(
        ROUTES.MCP_SERVER_SWITCH_TOOL(workspaceId, serverId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            access_token: access_token,
            "x-tenant-id": workspaceSlug,
          },
          body: JSON.stringify({ isActive }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return data;
    },

    onMutate: async ({
      serverId,
      isActive,
      workspaceId,
    }: ToggleMcpServerPayload) => {
      const queryKey = ["servers", workspaceId, "mcp-server-tools"];
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<McpServerToolsResponse>(queryKey);

      queryClient.setQueryData<McpServerToolsResponse>(queryKey, (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((server) =>
            server.id === serverId
              ? {
                  ...server,
                  mcpServer: {
                    ...server.mcpServer,
                    isActive: isActive,
                  },
                }
              : server,
          ),
        };
      });

      return { previousData };
    },

    onError: (
      err: Error,
      variables: ToggleMcpServerPayload,
      context: { previousData?: McpServerToolsResponse } | undefined,
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["servers", variables.workspaceId, "mcp-server-tools"],
          context.previousData,
        );
      }
      const message =
        err instanceof Error ? err.message : "Failed to toggle MCP server";
      toastUtils.generic.error(message);
    },

    onSettled: (
      data: ToggleMcpServerResponse | undefined,
      error: Error | null,
      variables: ToggleMcpServerPayload,
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["servers", variables.workspaceId, "mcp-server-tools"],
      });
    },

    onSuccess: (
      data: ToggleMcpServerResponse,
      variables: ToggleMcpServerPayload,
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["servers", variables.workspaceId, "mcp-server-tools"],
      });
      toastUtils.generic.success("MCP server toggled successfully");
    },
  });
}
