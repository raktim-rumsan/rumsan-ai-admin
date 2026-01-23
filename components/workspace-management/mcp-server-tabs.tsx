"use client";

import { useState } from "react";
import {
  Server,
  ChevronDown,
  Copy,
  CopyCheck,
  RefreshCcw,
  Plus,
  SquarePen,
  Trash2,
  Lock,
} from "lucide-react";
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
  useMcpServerQuery,
  useWorkspaceQuery,
  useToggleMcpToolsMutation,
  useToggleMcpServerSwitchMutation,
  type Workspace,
  useMCPDeleteMutation,
} from "@/queries/workspaceQuery";
import { useWorkspaceRole } from "@/hooks/useOrganizationContext";
import { McpServerEdit } from "../ai-tools/form/mcp-server-edit";
import { McpServerAdd } from "../ai-tools/form/mcp-server-add";
import ConfirmDelete from "../documents/DeleteModal";
import { McpTool, WorkspaceMcpServer } from "@/types/ai";
import { toastUtils } from "@/lib/toast-utils";
import truncateMiddleUrl from "@/lib/utils";

export default function McpServerTabs() {
  const { workSpaceSlug } = useParams();
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w: Workspace) => w.slug === workSpaceSlug,
  );

  const { isAdmin } = useWorkspaceRole(currentWorkspace?.id || "");

  const {
    data: mcpServers,
    isLoading: isLoadingTools,
    error: toolsError,
    refetch,
  } = useMcpServerQuery(
    currentWorkspace?.id as string,
    workSpaceSlug as string,
  );

  const servers: WorkspaceMcpServer[] = mcpServers?.data ?? [];

  const serversWithVisibleTools = servers.map((server) => {
    const visibleTools = isAdmin
      ? (server.mcpServer.mcpTools ?? [])
      : (server.mcpServer.mcpTools ?? []).filter((tool) => tool.enabled);

    return {
      ...server,
      mcpServer: {
        ...server.mcpServer,
        mcpTools: visibleTools,
      },
    };
  });

  // Mutation for toggling tool state
  const toggleToolMutation = useToggleMcpToolsMutation(
    currentWorkspace?.slug as string,
  );
  // Mutation for toggling server state
  const toggleServerMutation = useToggleMcpServerSwitchMutation(
    currentWorkspace?.id as string,
    currentWorkspace?.slug as string,
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  const [copiedServerId, setCopiedServerId] = useState<string | null>(null);
  const [refreshingServerId, setRefreshingServerId] = useState<string | null>(
    null,
  );
  const [currentDeleteInfo, setCurrentDeleteInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const editingServerData = mcpServers?.data?.find(
    (server) => server.id === editingId,
  );
  const deleteServerMutation = useMCPDeleteMutation(
    currentWorkspace?.id as string,
    currentWorkspace?.slug as string,
  );

  const [, setIsBrowseOpen] = useState(false);

  const handleToggleTool = (
    serverId: string,
    toolId: string,
    workspaceId: string,
  ) => {
    const server = servers?.find((s: WorkspaceMcpServer) => s.id === serverId);
    const tool = server?.mcpServer.mcpTools?.find(
      (t: McpTool) => t.id === toolId,
    );
    const newEnabledState = !tool?.enabled;
    toggleToolMutation.mutate({
      toolId,
      payload: {
        enabled: newEnabledState,
      },
      workspaceId,
    });
  };

  const handleToggleServer = (
    serverId: string,
    workspaceId: string,
    currentIsActive: boolean,
  ) => {
    toggleServerMutation.mutate({
      workspaceId,
      serverId,
      isActive: !currentIsActive,
    });
  };

  const humanizeToolName = (name: string): string =>
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleCopyUrl = (url: string, serverId: string) => {
    if (!url) return;

    navigator.clipboard.writeText(url);

    setCopiedServerId(serverId);
    setTimeout(() => setCopiedServerId(null), 2000);

    toastUtils.generic.success(
      "URL copied",
      "Server URL has been copied to clipboard.",
    );
  };

  const handleRefreshServer = (serverId: string) => {
    setRefreshingServerId(serverId);

    if (expandedServerId !== serverId) {
      setExpandedServerId(serverId);
    }

    refetch();
    setRefreshingServerId(null);
  };

  const handleDelete = () => {
    if (!currentDeleteInfo) return;

    // Just call the mutation; all toast handling is in the hook
    deleteServerMutation.mutate(currentDeleteInfo.id, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setCurrentDeleteInfo(null);
        refetch?.(); // optional, if you want to refetch manually
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">MCP Marketplace</h1>
          <h3 className="text-sm text-muted-foreground">
            {isAdmin
              ? "Manage MCP tools that the AI can reference."
              : "View MCP tools that the AI can reference."}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <McpServerAdd>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBrowseOpen(true)}
              className="cursor-pointer"
            >
              Browse All
            </Button>
          </McpServerAdd>
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
          serversWithVisibleTools.map((server: WorkspaceMcpServer) => (
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
                        expandedServerId === server.id ? null : server.id,
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
                      <div className="font-medium">
                        {server.mcpServer?.name}
                      </div>

                      {server.mcpServer.sectorName && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          {server.mcpServer.sectorName}
                        </span>
                      )}
                      {server.mcpServer.type === "EXTERNAL" && (
                        <Lock className="size-4 text-amber-600" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {truncateMiddleUrl(server.mcpServer?.url) || "No URL"}
                      </span>
                      {server.mcpServer?.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer p-1"
                          onClick={() =>
                            handleCopyUrl(server.mcpServer?.url, server.id)
                          }
                          aria-label="Copy URL"
                        >
                          {copiedServerId === server.id ? (
                            <CopyCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <TooltipProvider>
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
                            className={`w-4 h-4 mr-2 ${
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
                  </TooltipProvider>

                  {isAdmin &&
                    server.mcpServer?.type?.toUpperCase() === "EXTERNAL" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer p-2"
                        onClick={() => setEditingId(server.id ?? "")}
                      >
                        <SquarePen className="w-5 h-5 mr-2" />
                      </Button>
                    )}

                  {isAdmin && (
                    <Switch
                      checked={server.isActive}
                      onCheckedChange={() =>
                        handleToggleServer(
                          server.id,
                          currentWorkspace?.id as string,
                          server.isActive,
                        )
                      }
                      disabled={toggleServerMutation.isPending}
                    />
                  )}

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-red-600 hover:text-red-700 p-2"
                      onClick={() => {
                        setCurrentDeleteInfo({
                          id: server.id,
                          name: server.mcpServer?.name,
                        });
                        setOpenDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                    </Button>
                  )}
                </div>
              </div>

              {expandedServerId === server.id && (
                <div className="border-t p-4 bg-transparent">
                  <div className="text-xs text-muted-foreground font-medium mb-3">
                    AVAILABLE TOOLS ({server.mcpServer?.mcpTools?.length ?? 0})
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
                      {(server.mcpServer?.mcpTools ?? []).length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No tools available for this server.
                        </div>
                      ) : (
                        (server.mcpServer?.mcpTools ?? []).map((tool) => (
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
                                    currentWorkspace?.id as string,
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

        <ConfirmDelete
          isOpen={openDeleteModal}
          setIsOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
          isDeleting={deleteServerMutation.isPending}
          item={currentDeleteInfo?.name || ""}
        />
      </div>
      {editingId && editingServerData && (
        <McpServerEdit
          server={editingServerData}
          isOpen={Boolean(editingId)}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
