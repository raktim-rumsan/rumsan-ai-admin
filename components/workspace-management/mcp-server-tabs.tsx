"use client";

import { useState } from "react";
import { Server, ChevronDown, Copy, CopyCheck, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";

import {
  useMcpServerToolsQuery,
  useWorkspaceQuery,
  useToggleMcpToolsMutation,
  type Workspace,
  McpServer,
  McpTool,
} from "@/queries/workspaceQuery";
import { useWorkspaceRole } from "@/hooks/useOrganizationContext";

export default function McpServerTabs() {
  const { workSpaceSlug } = useParams();
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w: Workspace) => w.slug === workSpaceSlug
  );

  const { isAdmin } = useWorkspaceRole(currentWorkspace?.id || "");

  const {
    data: mcpServerTools,
    isLoading: isLoadingTools,
    error: toolsError,
    refetch,
  } = useMcpServerToolsQuery(currentWorkspace?.id as string);

  const servers: McpServer[] = mcpServerTools?.data ?? [];
  const serversWithVisibleTools = servers.map((server) => {
    const visibleTools = isAdmin
      ? server.mcpTools ?? [] // Admin sees all tools
      : (server.mcpTools ?? []).filter(
          (tool) => tool.enabled && server.isActive
        ); // Members see only enabled tools on active servers

    return {
      ...server,
      mcpTools: visibleTools, // replace mcpTools with filtered ones
    };
  });

  // Mutation for toggling tool state
  const toggleToolMutation = useToggleMcpToolsMutation(
    currentWorkspace?.slug as string
  );

  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  const [copiedServerId, setCopiedServerId] = useState<string | null>(null);
  const [refreshingServerId, setRefreshingServerId] = useState<string | null>(
    null
  );

  const handleToggleTool = (
    serverId: string,
    toolId: string,
    workspaceId: string
  ) => {
    const server = servers?.find((s: McpServer) => s.id === serverId);
    const tool = server?.mcpTools?.find((t: McpTool) => t.id === toolId);
    const newEnabledState = !tool?.enabled;

    toggleToolMutation.mutate({
      toolId,
      payload: {
        enabled: newEnabledState,
      },
      workspaceId,
    });
  };

  const humanizeToolName = (name: string): string =>
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleCopyUrl = async (url: string | undefined, serverId: string) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedServerId(serverId);
      setTimeout(() => {
        setCopiedServerId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleRefreshServer = (serverId: string) => {
    setRefreshingServerId(serverId);

    if (expandedServerId !== serverId) {
      setExpandedServerId(serverId);
    }

    refetch();
    setRefreshingServerId(null);
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">AI Tools Management</h1>
            <h3 className="text-sm text-muted-foreground">
              {isAdmin
                ? "Manage MCP tools that the AI can reference."
                : "View MCP tools that the AI can reference."}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {isLoadingTools ? (
            <div className="text-center py-12 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <p>Loading MCP servers...</p>
            </div>
          ) : toolsError ? (
            <div className="text-center py-12 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-red-500">
                Error loading MCP servers. Please try again.
              </p>
            </div>
          ) : !servers || servers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No MCP servers available</p>
            </div>
          ) : (
            serversWithVisibleTools.map((server: McpServer) => (
              <div
                key={server.id}
                className="rounded-lg border bg-card overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      aria-label="expand"
                      onClick={() =>
                        setExpandedServerId(
                          expandedServerId === server.id ? null : server.id
                        )
                      }
                      className="transform transition-transform"
                    >
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground ${
                          expandedServerId === server.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className="rounded-lg bg-muted p-3">
                      <Server className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{server.name}</div>
                        {server.sectorName && (
                          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            {server.sectorName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{server.url || "No URL"}</span>
                        {server.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 cursor-pointer"
                            onClick={() => handleCopyUrl(server.url, server.id)}
                            aria-label="Copy URL"
                          >
                            {copiedServerId === server.id ? (
                              <CopyCheck color="#5342d7" className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 cursor-pointer"
                          onClick={() => handleRefreshServer(server.id)}
                          disabled={refreshingServerId === server.id}
                        >
                          <RefreshCcw
                            color="#ec6436"
                            className={`w-4 h-4 ${
                              refreshingServerId === server.id
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh tools</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {expandedServerId === server.id && (
                  <div className="border-t p-4 bg-transparent">
                    <div className="text-xs text-muted-foreground font-medium mb-3">
                      AVAILABLE TOOLS ({server.mcpTools?.length ?? 0})
                    </div>

                    {refreshingServerId === server.id ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <RefreshCcw
                          color="#ec6436"
                          className="w-4 h-4 animate-spin"
                        />
                        <span>Refreshing tools...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(server.mcpTools ?? []).length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            No tools available for this server.
                          </div>
                        ) : (
                          (server.mcpTools ?? []).map((tool) => (
                            <div
                              key={tool.id}
                              className="flex items-center justify-between p-4 rounded-lg border"
                            >
                              <div>
                                <div className="font-medium">
                                  {humanizeToolName(tool.name)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {tool.description
                                    ?.replace(/Args:\s*/i, "")
                                    .replace(/Returns:\s*/i, "")
                                    .replace(/\[Note:[^\]]*\]/i, "")
                                    .trim()}
                                </div>
                              </div>

                              {isAdmin && (
                                <Switch
                                  checked={tool.enabled}
                                  onCheckedChange={() =>
                                    handleToggleTool(
                                      server.id,
                                      tool.id,
                                      currentWorkspace?.id as string
                                    )
                                  }
                                />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
