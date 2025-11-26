"use client";

import { use, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bot, FileText, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Member, Workspace } from "@/types/workspace-types";
import MembersTab from "@/components/workspace-management/members-tabs";
import LLMSettingsTab from "@/components/workspace-management/llm-settings-tabs";
import KnowledgebaseTab from "@/components/workspace-management/knowledegebase-tabs";
import WorkspaceHeader from "@/components/workspace-management/workspace-header";
import GeneralTab from "@/components/workspace-management/general-tab";
import {
  useWorkspaceQuery,
  type Workspace as WorkspaceQueryType,
} from "@/queries/workspaceQuery";

export default function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = use(params);
  const [members, setMembers] = useState<Member[]>([]);
  const { data: workspaceData, isLoading } = useWorkspaceQuery();
  let filterWorkspace: WorkspaceQueryType | undefined;

  if (!isLoading && workspaceData) {
    filterWorkspace = workspaceData?.data?.myWorkspaces.find(
      (ws) => ws.id === workspaceId
    );
  }

  const workspace: Workspace = {
    id: workspaceId,
    name: filterWorkspace?.name || "",
    description: filterWorkspace?.description || "",
    status: "active",
    color: "bg-blue-500",
    slug: filterWorkspace?.slug || "",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <WorkspaceHeader workspace={workspace} />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex items-center justify-between">
                <TabsList className="flex space-x-4">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" /> Members
              </TabsTrigger>
              <TabsTrigger value="llm">
                <Bot className="h-4 w-4 mr-2" /> LLM Settings
              </TabsTrigger>
              <TabsTrigger value="knowledgebase">
                <FileText className="h-4 w-4 mr-2" /> Industry Knowledge
              </TabsTrigger>
            </TabsList>
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href={`/dashboard?workspace=${workspace.slug}`}>
                <ExternalLink className="h-4 w-4 mr-2" /> Open Workspace
              </Link>
            </Button>
          </div>

          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
          <TabsContent value="members">
            <MembersTab members={members} setMembers={setMembers} />
          </TabsContent>
          <TabsContent value="llm">
            <LLMSettingsTab />
          </TabsContent>
          <TabsContent value="knowledgebase">
            <KnowledgebaseTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
