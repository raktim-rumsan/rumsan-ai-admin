import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";
import { getAuthToken } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWebDocumentsQuery(workspaceSlug: string) {
  return useQuery({
    queryKey: ["webDocuments"],
    queryFn: async () => {
      const access_token = getAuthToken();
      const res = await fetch(`${ROUTES.WEB_DOCUMENTS}`, {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug!,
          access_token: access_token!,
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

export function useCreateWebDocumentMutation(workspaceSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (webDocumentData: { url: string; content: string }) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.CREATE_WEB_DOCUMENT, {
        method: "POST",
        headers: {
          "x-tenant-id": workspaceSlug!,
          access_token: access_token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webDocumentData),
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
      queryClient.invalidateQueries({ queryKey: ["webDocuments"] });
    },
    onError: (error: Error) => {
      toastUtils.generic.error(
        "Error posting web document",
        error.message || "Something went wrong. Please try again."
      );
    },
  });
}

export function useUpdateWebDocumentMutation(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: {
        url?: string;
        content: string;
      };
    }) => {
      const access_token = getAuthToken();

      const res = await fetch(ROUTES.UPDATE_WEB_DOCUMENT(id), {
        method: "PATCH",
        headers: {
          "x-tenant-id": workspaceSlug,
          access_token: access_token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || data.error || `HTTP ${res.status}: ${res.statusText}`
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webDocuments"] });
    },
  });
}

export function useWebDocEmbeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webDocumentId: string) => {
      const workspaceId = workspaceSlug;
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WEB_DOCUMENT_EMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceId,
          access_token: access_token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: webDocumentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // API returns error message in 'message' field
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to train document (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
    retry: false,
    onSuccess: (data) => {
      toastUtils.generic.success(data?.data?.status, data?.data?.message);
      // Invalidate documents query to refetch the list and update status
      queryClient.invalidateQueries({ queryKey: ["webDocuments"] });
      onSuccess?.();
    },
  });
}

export function useWebDocUnembeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webDocumentId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.WEB_DOCUMENT_UNEMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug,
          access_token: access_token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: webDocumentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // API returns error message in 'message' field
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to unembed document (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toastUtils.generic.success(data?.data?.status, data?.data?.message);
      // Invalidate documents query to refetch the list and update status
      queryClient.invalidateQueries({ queryKey: ["webDocuments"] });
      onSuccess?.();
    },
  });
}

export function useWebDocDeleteMutation(
  workspaceSlug?: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webDocumentId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.DELETE_WEB_DOCUMENT(webDocumentId), {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token!,
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
      // Invalidate documents query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["webDocuments"] });
      onSuccess?.();
    },
  });
}
