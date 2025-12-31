"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { useWorkspaceRole } from "@/hooks/useOrganizationContext";
import { useParams } from "next/navigation";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import {
  AiToolsManagementError,
  AiToolsManagementLoading,
} from "./ai-tool-management-loading";
import { useAiToolsQuery } from "@/queries/aiToolQuery";

interface AiTool {
  id: string;
  name: string;
  doc: string;
  sector?: string;
  enabled: boolean;
}

export default function AiToolsManagementTab() {
  const params = useParams();
  const workSpaceSlug = params?.workSpaceSlug as string;

  const { data, isError, isLoading } = useAiToolsQuery(workSpaceSlug);

  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w) => w.slug === workSpaceSlug
  );
  const workspaceId = currentWorkspace?.id || "";
  const { isAdmin } = useWorkspaceRole(workspaceId);

  // Initialize local state with default enabled=false
  const [tools, setTools] = useState<AiTool[]>(
    () =>
      (data?.tools ?? []).map((tool: any) => ({
        ...tool,
        enabled: false,
        id: tool.id ?? tool.name, // fallback if id not present
      }))
  );

  // Sync tools when API data changes
  useEffect(() => {
    if (!data?.tools) return;

    setTools(
      data.tools.map((tool: any) => ({
        ...tool,
        enabled: tools.find((t) => t.id === (tool.id ?? tool.name))?.enabled ?? false,
        id: tool.id ?? tool.name,
      }))
    );
  }, [data?.tools]);

  // Toggle single tool
  const handleToggle = (toolId: string, enabled: boolean) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, enabled } : tool
      )
    );
  };

  // Toggle all tools
  const handleToggleAll = (enabled: boolean) => {
    setTools((prev) => prev.map((tool) => ({ ...tool, enabled })));
  };

  const allEnabled = tools.length > 0 && tools.every((tool) => tool.enabled);

  const toReadableName = (value: string) => {
  return value
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};
  if (isError) return <AiToolsManagementError error={isError} />;
  if (isLoading) return <AiToolsManagementLoading />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Tools Management</CardTitle>
              <CardDescription className="mt-2">
                Manage MCP tools that the AI can reference.
              </CardDescription>
            </div>
            {isAdmin && tools.length > 0 && (
              <div className="flex items-center gap-4 mt-4">
                <Switch
                  checked={allEnabled}
                  onCheckedChange={handleToggleAll}
                />
                <span className="text-sm font-medium">
                  {allEnabled ? "All Enabled" : "Enable All"}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tools.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No MCP tools available</p>
              </div>
            ) : (
              tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <Cpu className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{toReadableName(tool.name)}</div>
                      <div className="text-sm text-muted-foreground">
                        {tool.doc}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={(value) =>
                          handleToggle(tool.id, value)
                        }
                      />
                      <span
                        className={`text-sm font-medium ${
                          tool.enabled ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tool.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
