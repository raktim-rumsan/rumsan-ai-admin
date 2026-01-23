"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Eye,
  EyeOff,
  Plus,
  Trash,
  Lock,
  Server,
  Copy,
  CopyCheck,
} from "lucide-react";
import { toastUtils } from "@/lib/toast-utils";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { mcpServerSchema } from "./schema";
import { AuthEntry, FormValues, McpServer } from "@/types/ai";
import {
  useAvailableMcpServerQuery,
  useWorkspaceQuery,
  Workspace,
} from "@/queries/workspaceQuery";
import { useParams } from "next/navigation";
import { truncateMiddleUrl, humanizeToolName } from "@/lib/utils";
import { McpServerPicker } from "@/components/ai-tools/browse-available-servers-dialog";
interface CommonMcpServerFormProps {
  mode: "create" | "edit-auth";
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
  onCancel?: () => void;
  isPending?: boolean;
  className?: string;
}

export function CommonMcpServerForm({
  mode,
  onSubmit,
  defaultValues,
  onCancel,
  isPending,
}: CommonMcpServerFormProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [copiedServerId, setCopiedServerId] = useState<string | null>(null);

  const { workSpaceSlug } = useParams();
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w: Workspace) => w.slug === workSpaceSlug,
  );
  const { data: mcpServers } = useAvailableMcpServerQuery(
    currentWorkspace?.id as string,
    workSpaceSlug as string,
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(mcpServerSchema),
    defaultValues,
  });

  const selectedServer = watch("server");

  const shouldShowAuth = selectedServer?.type === "EXTERNAL";

  const [pickedServer, setPickedServer] = useState<McpServer | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authentication",
  });

  const authWatch = watch("authentication");

  const enterJsonMode = () => {
    const obj: Record<string, string> = {};
    (authWatch || []).forEach((entry) => {
      if (entry?.key?.trim()) obj[entry.key.trim()] = entry.value ?? "";
    });
    setJsonText(Object.keys(obj).length ? JSON.stringify(obj, null, 2) : "{}");
    setIsJsonMode(true);
  };

  const exitJsonMode = () => {
    try {
      const parsed = JSON.parse(jsonText || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid JSON object");
      }
      const arr: AuthEntry[] = Object.entries(parsed).map(([k, v]) => ({
        key: k,
        value: String(v ?? ""),
        show: false,
        isEncrypted: true,
      }));
      setValue("authentication", arr);
      setIsJsonMode(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      toastUtils.generic.error(message);
    }
  };

  // const handleCopyUrl = (url: string, serverId: string) => {
  //   if (!url) return;

  //   navigator.clipboard.writeText(url);

  //   setCopiedServerId(serverId);
  //   setTimeout(() => setCopiedServerId(null), 2000);

  //   toastUtils.generic.success(
  //     "URL copied",
  //     "Server URL has been copied to clipboard.",
  //   );
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1 min-h-0 gap-4"
    >
      {mode === "create" && !selectedServer && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <Label>Browse & select MCP server</Label>

          <McpServerPicker
            servers={mcpServers ?? []}
            selectedId={pickedServer?.id || selectedServer?.id}
            onSelect={(server) => {
              setPickedServer(server);
            }}
          />

          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (onCancel) return onCancel();
                setPickedServer(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (!pickedServer) return;
                setValue("server", pickedServer);
                setValue("authentication", []);
              }}
              disabled={!pickedServer || isPending}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

      {selectedServer && (
        <>
          {/* Server summary */}
          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Server className="size-4 text-muted-foreground" />
              <span className="font-medium">{selectedServer.name}</span>
              {selectedServer.sectorName && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {selectedServer.sectorName}
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${
                  selectedServer.type === "EXTERNAL"
                    ? "border-amber-500 text-amber-600"
                    : "border-emerald-500 text-emerald-600"
                }`}
              >
                {selectedServer.type === "EXTERNAL" && (
                  <Lock className="size-3" />
                )}
                {selectedServer.type}
              </Badge>
            </div>
            {/* <div className="flex items-center gap-1 mt-2">
              <p className="text-xs text-muted-foreground">
                {truncateMiddleUrl(selectedServer.url)}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer p-1"
                onClick={() =>
                  handleCopyUrl(selectedServer?.url, selectedServer.id)
                }
                aria-label="Copy URL"
              >
                {copiedServerId === selectedServer.id ? (
                  <CopyCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div> */}
            <p className="text-xs text-muted-foreground mt-1">
              {selectedServer.mcpTools?.length} tool
              {selectedServer.mcpTools?.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <div className="mt-3">
            <Label>
              {mode === "create"
                ? `TOOLS TO BE ADDED (${selectedServer.mcpTools?.length ?? 0})`
                : `TOOLS ADDED (${selectedServer.mcpTools?.length ?? 0})`}
            </Label>
            <div
              className={`mt-2 space-y-2 pr-2 overflow-auto ${
                shouldShowAuth ? "max-h-[28vh]" : "max-h-[36vh]"
              }`}
            >
              {(selectedServer.mcpTools || []).map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 border rounded-lg bg-background/50 text-sm"
                >
                  <div className="font-medium">
                    {humanizeToolName(tool.name)}
                  </div>
                  {tool.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Authentication (only for external servers) */}
          {shouldShowAuth && (
            <div className="grid gap-2 min-h-0">
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="authentication">
                    Authentication Credentials
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    {mode === "create"
                      ? "Add authentication for the MCP server"
                      : "Update API keys or authentication headers for this server"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isJsonMode ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={enterJsonMode}
                    >
                      JSON
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={exitJsonMode}
                    >
                      Switch to Form
                    </Button>
                  )}
                  {!isJsonMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        append({
                          key: "",
                          value: "",
                          show: false,
                          isEncrypted: false,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 pr-2 overflow-auto max-h-[28vh]">
                {!isJsonMode ? (
                  fields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-3 border rounded-lg relative"
                    >
                      <div className="grid gap-2">
                        <Input
                          placeholder="key (e.g., mcp-authentication)"
                          {...register(`authentication.${idx}.key` as const)}
                        />
                        {errors.authentication?.[idx]?.key?.message && (
                          <p className="text-sm text-destructive">
                            {String(errors.authentication?.[idx]?.key?.message)}
                          </p>
                        )}
                        <div className="relative">
                          <Input
                            placeholder="value"
                            type={authWatch[idx]?.show ? "text" : "password"}
                            {...register(
                              `authentication.${idx}.value` as const,
                            )}
                            className="pr-18"
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setValue(`authentication.${idx}.value`, newValue);
                              setValue(
                                `authentication.${idx}.isEncrypted`,
                                false,
                              );
                            }}
                          />
                          {errors.authentication?.[idx]?.value?.message && (
                            <p className="text-sm text-destructive mt-1">
                              {String(
                                errors.authentication?.[idx]?.value?.message,
                              )}
                            </p>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-10 top-2 h-8 w-8 p-0"
                            onClick={() =>
                              setValue(
                                `authentication.${idx}.show`,
                                !authWatch[idx]?.show,
                              )
                            }
                          >
                            {authWatch[idx]?.show ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 p-0 text-destructive"
                            onClick={() => remove(idx)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <textarea
                      className="w-full min-h-[120px] rounded-md border p-3 text-sm font-mono bg-background"
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      placeholder={`{\n  "mcp-authentication": "secret"\n}`}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter headers as a JSON object with string key-value
                      pairs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {mode === "edit-auth" ? "Save Changes" : "Add Server"}
            </Button>
          </DialogFooter>
        </>
      )}
    </form>
  );
}
