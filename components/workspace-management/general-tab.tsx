"use client";

import React, { useState } from "react";
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
import { useUpdateWorkspace, useWorkspaceQuery } from "@/queries/workspaceQuery";
import Link from "next/link";
import { Settings } from "lucide-react";
import GeneralTabSkeleton from "./general-tab-loading";

const SECTORS = ["banking", "veterinary", "dentistry"];

export default function GeneralTab() {
  const { id: workspaceId } = useParams();

  const { data: workspaceData, isLoading } = useWorkspaceQuery();
  const updateWorkspace = useUpdateWorkspace();

  // Find the workspace from the query
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find((w: any) => w.id === workspaceId);
  // Local state only tracks user edits
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [botName, setBotName] = useState<string>();
  const [sector, setSector] = useState<string>();

  // Compute values for inputs: prefer edited value, fallback to query, fallback to empty
  const workspaceName = name ?? currentWorkspace?.name ?? "";
  const workspaceDescription = description ?? currentWorkspace?.description ?? "";
  const workspaceBotName = botName ?? currentWorkspace?.botName ?? "";
  const workspaceSector = sector ?? currentWorkspace?.sector ?? "";

  const handleSave = () => {
    if (!workspaceId) return;

    updateWorkspace.mutate({
      id: workspaceId as string,
      payload: {
        name: workspaceName,
        description: workspaceDescription,
        botName: workspaceBotName,
        sector: workspaceSector,
      },
    });
  };

  return (
    <>
      {isLoading ? (
          <GeneralTabSkeleton />
        ) : (
    <div className="space-y-6">
      {/* General Workspace Card */}
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
                value={workspaceName}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full"
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
                value={workspaceBotName}
                onChange={(e) => setBotName(e.target.value)}
                className="h-12 w-full"
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
              <Select value={workspaceSector} onValueChange={(v) => setSector(v)}>
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

            {/* Workspace Description */}
            <div className="space-y-3 col-span-2">
              <Label htmlFor="workspace-description" className="text-base font-medium">
                Workspace Description
              </Label>
              <Textarea
                id="workspace-description"
                value={workspaceDescription}
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
            <Button onClick={handleSave} className="h-12 px-8">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization-wide Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
              <Settings />
            </div>
            <div>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure organization-wide settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Security Settings</p>
                <p className="text-sm text-muted-foreground">
                  2FA, SSO, and access controls
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">API Keys</p>
                <p className="text-sm text-muted-foreground">
                  Manage API access
                </p>
              </div>
              <Link href={`/admin/api-keys?workspaceId=${workspaceId}`}>
                <Button variant="outline" size="sm">
                  View Keys
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    )}
</>
  );
}
