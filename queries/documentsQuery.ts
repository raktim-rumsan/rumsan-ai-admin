import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";

import { ROUTES } from "@/constants";
import { toastUtils } from "@/lib/toast-utils";
import { Doc } from "@/types/workspace-types";

export function useDocUploadMutation(
  workspaceSlug?: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.UPLOAD_DOCUMENTS, {
        method: "POST",
        body: formData,
        headers: {
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token || "",
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
      // Invalidate documents query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}

export function useDocsQuery(workspaceSlug?: string) {
  return useQuery({
    queryKey: ["documents", workspaceSlug],
    queryFn: async () => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.DOCUMENTS, {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug || "",
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

export function useDocDeleteMutation(
  workspaceSlug?: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.DELETE_DOCUMENT(documentId), {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
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
      // Invalidate documents query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}

export function useKnowledgebaseQuery(workspaceSlug: string, sector: string) {
  return useQuery({
    queryKey: ["knowledgebase", workspaceSlug],
    queryFn: async (): Promise<Doc[]> => {
      const access_token = getAuthToken();

      const envIndustries =
        process.env.NEXT_PUBLIC_INDUSTRY_VALUES?.split(",").map((i) =>
          i.trim()
        ) || [];

      const queryString = sector
        ? `?industry=${sector}`
        : envIndustries.length > 0
        ? `?industry=${envIndustries.join(",")}`
        : "";

      const res = await fetch(`${ROUTES.KNOWLEDGEBASE}${queryString}`, {
        method: "GET",
        headers: {
          "x-tenant-id": workspaceSlug || "",
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

      return data.data || [];
    },
    staleTime: 10_000,
  });
}

export function useEmbeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const workspaceId = workspaceSlug;
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.EMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceId || "",
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentId,
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
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}

export function useUnembeddingMutation(
  workspaceSlug: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const access_token = getAuthToken();
      const res = await fetch(ROUTES.UNEMBEDDINGS, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentId,
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
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.();
    },
  });
}

export function useToggleDocumentStatusMutation(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const access_token = getAuthToken();

      const res = await fetch(ROUTES.TOGGLE_DOCUMENT_STATUS(documentId), {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "x-tenant-id": workspaceSlug || "",
          access_token: access_token || "",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to toggle");
      }
      return data;
    },

    onMutate: async (documentId) => {
      // Cancel any pending refetch so it doesn't overwrite optimistic
      await queryClient.cancelQueries({
        queryKey: ["knowledgebase", workspaceSlug],
      });

      // Snapshot previous value
      const previousDocs = queryClient.getQueryData<Doc[]>([
        "knowledgebase",
        workspaceSlug,
      ]);

      // Apply optimistic update
      queryClient.setQueryData<Doc[]>(
        ["knowledgebase", workspaceSlug],
        (oldDocs = []) =>
          oldDocs.map((doc) =>
            doc.id === documentId ? { ...doc, enabled: !doc.enabled } : doc
          )
      );

      return { previousDocs };
    },
    // rollback if fails
    onError: (err, documentId, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(
          ["knowledgebase", workspaceSlug],
          context.previousDocs
        );
      }
      toastUtils.generic.error("Error", err.message);
    },
    onSuccess: (data) => {
      toastUtils.generic.success(data.data.message);
    },

    // refetch once done (safe)
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgebase", workspaceSlug],
      });
    },
  });
}

export function viewDocument(url: string) {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_API!;
  const fileUrl = `${serverUrl}/assets/${url.replace(/^uploads\//, "")}`;
  window.open(fileUrl, "_blank");
}
