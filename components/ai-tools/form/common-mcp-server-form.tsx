"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff, Plus, Trash, Lock, Key, Server } from "lucide-react";
import { toastUtils } from "@/lib/toast-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { mcpServerSchema } from "./schema";
import { AuthEntry, FormValues } from "@/types/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { url } from "inspector";
interface CommonMcpServerFormProps {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
  isEdit?: boolean;
  onCancel?: () => void;

  servers?: {
    id: string;
    name: string;
    isExternal: boolean;
    url: string;
    sector?: string;
    tools: string[];
  }[]; // new
}

const mockServers = [
  {
    id: "server1",
    name: "MCP Server 1",
    isExternal: false,
    url: "http://internal-mcp.local",
    sector: "Finance",
    tools: ["tool1", "tool2"],
  },
  {
    id: "server2",
    name: "MCP Server 2",
    isExternal: true,
    url: "http://external-mcp.local",
    sector: "Healthcare",
    tools: ["tool3", "tool4"],
  },
  {
    id: "server3",
    name: "MCP Server 3",
    isExternal: false,
    url: "http://internal-mcp2.local",
    sector: "Technology",
    tools: ["tool5", "tool6"],
  },
  {
    id: "server4",
    name: "MCP Server 4",
    isExternal: false,
    url: "http://internal-mcp.local",
    sector: "Finance2",
    tools: ["tool7", "tool8"],
  },
  {
    id: "server5",
    name: "MCP Server 5",
    isExternal: true,
    url: "http://external-mcp.local",
    sector: "Healthcare2",
    tools: ["tool9", "tool10"],
  },
  {
    id: "server6",
    name: "MCP Server 6",
    isExternal: false,
    url: "http://internal-mcp2.local",
    sector: "Technology2",
    tools: ["tool11", "tool12"],
  },
];

export function CommonMcpServerForm({
  onSubmit,
  defaultValues,
  isEdit = false,
  onCancel,
  servers,
}: CommonMcpServerFormProps) {
  const [step, setStep] = useState<"select" | "auth">("select");
  const [selectedServer, setSelectedServer] = useState<{
    id: string;
    name: string;
    isExternal: boolean;
    url: string;
    sector?: string;
    tools: string[];
  } | null>(null);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid gap-4">
        <Label>Select Server</Label>
        <Select
          value={selectedServer?.id || ""}
          onValueChange={(val) => {
            const server = (servers ?? mockServers)?.find((s) => s.id === val);
            setSelectedServer(server || null);
            if (server) {
              if (server.isExternal) setStep("auth");
              else setStep("select");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an MCP server..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" /> Ready to Use
              </SelectLabel>
              {(servers ?? mockServers)
                .filter((s) => !s.isExternal)
                .map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    <div className="flex flex-col">
                      <span className="truncate">{server.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-500" /> Requires Setup
              </SelectLabel>
              {(servers ?? mockServers)
                .filter((s) => s.isExternal)
                .map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    <div className="flex flex-col">
                      <span className="truncate">{server.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedServer && (
        <>
          {/* Server summary */}
          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                  <Server className="size-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold">
                    {selectedServer.name}
                  </h4>
                  <span className="inline-block text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground">
                    {selectedServer.sector ?? "general"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  {selectedServer.url}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedServer.tools.length} tools available
                </p>
              </div>
            </div>
          </div>

          {/* Authentication (only for external servers) */}
          {selectedServer.isExternal && (
            <div className="grid gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="authentication">Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add authentication for the MCP server
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

              <div className="space-y-2">
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
                              `authentication.${idx}.value` as const
                            )}
                            className="pr-18"
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setValue(`authentication.${idx}.value`, newValue);
                              setValue(
                                `authentication.${idx}.isEncrypted`,
                                false
                              );
                            }}
                          />
                          {errors.authentication?.[idx]?.value?.message && (
                            <p className="text-sm text-destructive mt-1">
                              {String(
                                errors.authentication?.[idx]?.value?.message
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
                                !authWatch[idx]?.show
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
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Server"}
            </Button>
          </DialogFooter>
        </>
      )}
    </form>
  );
}
