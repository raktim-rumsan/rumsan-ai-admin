import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAiToolsQuery(workspaceSlug?: string, sector?: string) {
  return useQuery({
    queryKey: ["aiTools", workspaceSlug, sector ?? ""],
    queryFn: async () => {
      // Build query string if needed
      const queryString = sector ? `?sector=${sector}` : "";

      // Call local proxy API to avoid CORS issues
      const res = await fetch(`/api/ai-tools${queryString}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      // Optional: filter or transform the data if needed
      console.log("Fetched AI Tools data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}



// This simulates toggling a tool on/off for a workspace
export function useToggleAiToolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      toolId,
      workspaceSlug,
      enabled,
    }: {
      toolId: string;
      workspaceSlug?: string;
      enabled: boolean;
    }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Return the updated tool (mock)
      return { toolId, enabled };
    },
    // Optimistic update: immediately update local query cache
    onMutate: async ({ toolId, workspaceSlug, enabled }) => {
      const queryKey = ["aiTools", workspaceSlug ?? ""];
      const previousTools = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((tool: any) =>
          tool.id === toolId ? { ...tool, enabled } : tool
        )
      );

      return { previousTools };
    },
    // If mutation fails, rollback
    onError: (_err, _variables, context: any) => {
      const queryKey = ["aiTools", _variables.workspaceSlug ?? ""];
      queryClient.setQueryData(queryKey, context.previousTools);
    },
    // After mutation, refetch query (optional)
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["aiTools", variables.workspaceSlug ?? ""],
      });
    },
  });
}
