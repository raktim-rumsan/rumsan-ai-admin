"use client";

import { Check, ChevronUp, Lock, Server, Unlock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { cn, humanizeToolName } from "@/lib/utils";
import { McpServer } from "@/types/ai";
import { useState } from "react";

interface McpServerPickerProps {
  servers: McpServer[];
  selectedId?: string;
  onSelect: (server: McpServer) => void;
  isLoading?: boolean;
}

export function McpServerPicker({
  servers,
  selectedId,
  onSelect,
  isLoading = false,
}: McpServerPickerProps) {
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [expandedServers, setExpandedServers] = useState<Set<string>>(
    new Set(),
  );

  const publicServers = servers.filter((s) => s.type === "INTERNAL");
  const privateServers = servers.filter((s) => s.type === "EXTERNAL");

  const toggleExpand = (serverId: string) => {
    setExpandedServers((prev) => {
      const next = new Set(prev);
      if (next.has(serverId)) next.delete(serverId);
      else next.add(serverId);
      return next;
    });
  };

  const renderServerCard = (server: McpServer) => {
    const isSelected = selectedId === server.id;
    const isExpanded = expandedServers.has(server.id);

    return (
      <div
        key={server.id}
        className={cn(
          "rounded-lg border cursor-pointer transition-all",
          isSelected
            ? "border-primary bg-primary/5"
            : "bg-card hover:bg-accent/50",
        )}
        onClick={() => onSelect(server)}
      >
        <div className="flex items-center gap-4 p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(server.id);
            }}
            className="flex size-8 items-center justify-center shrink-0 cursor-pointer hover:bg-muted rounded-md transition-colors"
          >
            <ChevronUp
              className={cn(
                "size-5 text-muted-foreground transition-transform duration-200",
                !isExpanded && "rotate-180",
              )}
            />
          </button>

          <div className="flex size-10 items-center justify-center rounded-md bg-muted shrink-0">
            <Server className="size-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium">{server.name}</h3>
              {server.sectorName && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {server.sectorName}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {server.mcpTools?.length ?? 0} tool
              {(server.mcpTools?.length ?? 0) !== 1 ? "s" : ""} available
            </p>
          </div>

          <div
            className={cn(
              "size-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
              isSelected
                ? "border-primary bg-primary"
                : "border-muted-foreground/30",
            )}
          >
            {isSelected && <Check className="size-3 text-primary-foreground" />}
          </div>
        </div>

        {isExpanded && (
          <div className="border-t bg-muted/30 px-4 py-3 ml-[52px]">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              AVAILABLE TOOLS ({server.mcpTools?.length ?? 0})
            </p>
            <div className="flex flex-col gap-2">
              {(server.mcpTools || []).map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 rounded-md bg-background border"
                >
                  <p className="font-medium text-sm">
                    {humanizeToolName(tool.name)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderList = (list: McpServer[]) =>
    list.length === 0 ? (
      <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <Server className="size-10 mb-3 opacity-50" />
        <p className="font-medium">No {activeTab} servers available</p>
        <p className="text-sm mt-1">
          All {activeTab} servers have been added to this workspace.
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-3 pr-1">
        {list.map(renderServerCard)}
      </div>
    );

  const renderSkeletonList = () => (
    <div className="flex flex-col gap-3 pr-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="rounded-lg border bg-card p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-md bg-muted">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div className="size-5 rounded-full">
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "public" | "private")}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="grid w-full grid-cols-2 shrink-0 scrollbar-hide">
          <TabsTrigger value="public" className="cursor-pointer">
            <Unlock className="size-3.5 mr-1.5" /> Public (
            {publicServers.length})
          </TabsTrigger>
          <TabsTrigger value="private" className="cursor-pointer">
            <Lock className="size-3.5 mr-1.5" /> Private (
            {privateServers.length})
          </TabsTrigger>
        </TabsList>

        {/* This wrapper ensures the content can scroll */}
        <div className="flex-1 mt-4 min-h-0 scrollbar-hide overflow-hidden">
          <TabsContent
            value="public"
            className="h-full overflow-y-auto px-1 pb-1 max-h-[56vh] thin-scrollbar"
            tabIndex={0}
          >
            {isLoading ? renderSkeletonList() : renderList(publicServers)}
          </TabsContent>

          <TabsContent
            value="private"
            className="h-full overflow-y-auto px-1 pb-1 max-h-[56vh] thin-scrollbar"
            tabIndex={0}
          >
            {isLoading ? renderSkeletonList() : renderList(privateServers)}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
