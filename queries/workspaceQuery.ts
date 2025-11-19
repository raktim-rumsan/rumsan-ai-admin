import { ROUTES } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";
import { useCreateApiKey } from "./apiKeysQuery";

export interface Workspace {
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
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const createApiKeyMutation = useCreateApiKey();
  return useMutation({
    mutationFn: async (workspaceData: {
      name: string;
      description?: string;
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
    onSuccess: async (data) => {
      const { data: workspaceData } = data;
      localStorage.setItem("workspaceId", workspaceData.slug);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      try {
        await createApiKeyMutation.mutateAsync({
          name: `${workspaceData.name}-default-key`,
        });
      } catch (error) {
        console.error("Failed to create default API key:", error);
        toastUtils.generic.error(
          "API key creation failed",
          "Organization created successfully, but default API key could not be generated."
        );
      }
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error creating workspace",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

export function useInvitationWorkspaceMutation(workspaceIdParam?: string) {
  const queryClient = useQueryClient();
  const workspaceId = localStorage.getItem("workspaceId");

  return useMutation({
    mutationFn: async (payload: CreateInvitationPayload) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACEINVITE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": workspaceId || "",
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
        queryKey: ["workspaces", workspaceIdParam],
      });
      toastUtils.invitations.sendSuccess(1);
    },
    onError: (error: Error) => {
      toastUtils.invitations.sendError(error.message);
    },
  });
}

export function useWorkspaceMemberQuery(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    staleTime: 10_000,
    refetchInterval: 10_000, // Automatically refetch every 5 seconds
    queryFn: async (): Promise<WorkspacesMemberResponse> => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WORKSPACE_MEMBER(workspaceId), {
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
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}
