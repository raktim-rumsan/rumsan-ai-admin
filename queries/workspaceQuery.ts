import { ROUTES } from "@/constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { toastUtils } from "@/lib/toast-utils";

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
        error.message || "Something went wrong. Please try again."
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
      const previousWorkspaces = queryClient.getQueryData<any>(["workspaces"]);
      const previousWorkspace = queryClient.getQueryData<any>([
        "workspaces",
        params.id,
      ]);

      // Optimistically update the workspace
      queryClient.setQueryData(["workspaces", params.id], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          ...params.payload,
        },
      }));

      queryClient.setQueryData(["workspaces"], (old: any) => {
        if (!old) return old;
        const updated = old.data?.myWorkspaces?.map((w: any) =>
          w.id === params.id ? { ...w, ...params.payload } : w
        );
        return { ...old, data: { ...old.data, myWorkspaces: updated } };
      });

      return { previousWorkspaces, previousWorkspace };
    },
    onSuccess: () => {
      toastUtils.generic.success("Workspace updated successfully");
    },

    onError: (err, _variables, context: any) => {
      toastUtils.generic.error(err.message || "Failed to update workspace");
      // Rollback cache
      if (context?.previousWorkspace) {
        queryClient.setQueryData(
          ["workspaces", context.previousWorkspace.id],
          context.previousWorkspace
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
    (w) => w.slug === workspaceSlug
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
  onSuccess?: () => void
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
  onSuccess?: () => void
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
        error.message || "Something went wrong. Please try again."
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
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}
