"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import {
  useWorkspaceSettingQuery,
  useUpdateWorkspaceSetting,
} from "@/queries/workspaceSettingQuery";
import { toastUtils } from "@/lib/toast-utils";
import { useApiKeys } from "@/queries/apiKeysQuery";

const SECTORS = ["banking", "dentistry", "marketing", "education", "healthcare"];

export default function GeneralTab() {
  const { id: workspaceId } = useParams();

  const { data: workspaceData, isLoading: workspaceLoading } = useWorkspaceQuery();
  console.log(workspaceData, 'workspaceData');
  const { data: workspaceSettings, isPending: settingsLoading } = useWorkspaceSettingQuery();
  const { data: apiKeys } = useApiKeys();
console.log(apiKeys, 'apiKeys');
  const updateWorkspaceSetting = useUpdateWorkspaceSetting();
console.log(workspaceSettings, 'workspaceSettings');
  const filterWorkspace = workspaceData?.data?.myWorkspaces?.find((w: any) => w.id === workspaceId);
const defaultApiKey = apiKeys
  ?.slice()
  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
  ?.apiKey || "";
//   const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [botName, setBotName] = useState("");
  const [sector, setSector] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       // Update workspace settings on server (botName / sector / apiKey)
//       updateWorkspaceSetting.mutate(
//         {
//           id: workspaceId,
//           botName,
//           sector,
//           apiKey,
//         } as any,
//         {
//           onSuccess: () => {
//             toastUtils.generic.success("Saved", "Workspace general settings updated");
//             // update workspaceName used in header
//             try {
//               if (workspace) localStorage.setItem("workspaceName", name);
//             } catch (e) {}
//             // Clear local draft after successful save
//             try {
//               localStorage.removeItem(`workspace_general_${workspaceId}`);
//             } catch (e) {}
//           },
//           onError: (err: any) => {
//             toastUtils.generic.error("Error", err?.message || "Failed to save settings");
//           },
//           onSettled: () => setIsSaving(false),
//         }
//       );
//     } catch (e) {
//       setIsSaving(false);
//       toastUtils.generic.error("Error", (e as any)?.message || "Failed to save");
//     }
//   };

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>General Workspace Settings</CardTitle>
            <CardDescription className="mt-2">
              Basic workspace information and bot configuration.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
            {/* Workspace Name */}
            <div className="space-y-3 col-span-2">
            <Label htmlFor="workspace-name" className="text-base font-medium">
                Workspace Name
            </Label>
                <Input
                id="workspace-name"
                value={filterWorkspace?.name || ""}
                readOnly
                className="h-12 w-full bg-gray-100"
                />
            <p className="text-sm text-gray-500">
                This is the visible name used across the app.
            </p>
            </div>

            {/* Bot Name */}
            <div className="space-y-3">
            <Label htmlFor="bot-name" className="text-base font-medium">
                Bot Name
            </Label>
            <Input
                id="bot-name"
                value={workspaceSettings?.data?.llmModel || ""}
                readOnly
                className="h-12 w-full bg-gray-100"
            />
            <p className="text-sm text-gray-500">
                Name used by the assistant/chatbot in this workspace.
            </p>
            </div>

            {/* Workspace Sector */}
            <div className="space-y-3">
            <Label htmlFor="sector" className="text-base font-medium">
                Workspace Sector
            </Label>
            <Select value={sector} onValueChange={(v) => setSector(v)}>
                <SelectTrigger id="sector" className="h-12 w-full">
                <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent>
                {SECTORS.map((s) => (
                    <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
                Choose the sector to help tailor defaults and datasets.
            </p>
            </div>

            {/* API Key */}
            <div className="space-y-3 col-span-2">
            <Label htmlFor="api-key" className="text-base font-medium">
                API Key
            </Label>
            <Input
                id="api-key"
                value={defaultApiKey}
                // onChange={(e) => setApiKey(e.target.value)}
                className="h-12 w-full bg-gray-100"
            />
            <p className="text-sm text-gray-500">
                Optional: provide an API key for widget/chat integrations.
            </p>
            </div>

            {/* Workspace Description */}
            <div className="space-y-3 col-span-2">
            <Label htmlFor="workspace-description" className="text-base font-medium">
                Workspace Description
            </Label>
            <Textarea
                id="workspace-description"
                value={filterWorkspace?.description || ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full"
            />
            <p className="text-sm text-gray-500">
                Short description of the workspace purpose (optional).
            </p>
            </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 pt-6">
            <Button
            // onClick={handleSave}
            disabled={isSaving || updateWorkspaceSetting.isPending}
            className="h-12 px-8"
            >
            {isSaving || updateWorkspaceSetting.isPending ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        </CardContent>
            </Card>
        </>
);
}
