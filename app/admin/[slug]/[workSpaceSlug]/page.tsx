"use client";

import { use, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import IntegrationLists from "@/components/sections/integrations/integration-list";
import { tablist } from "@/constants/workspace-tabs";

export default function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ workSpaceSlug: string }>;
}) {
  const { workSpaceSlug } = use(params);
  const [members, setMembers] = useState<Member[]>([]);
  const router = useRouter();
  const { data: workspaceData, isLoading } = useWorkspaceQuery();
  let filterWorkspace: WorkspaceQueryType | undefined;

  if (!isLoading && workspaceData) {
    filterWorkspace = workspaceData?.data?.myWorkspaces.find(
      (ws) => ws.slug === workSpaceSlug
    );
  }

  // Redirect if user is WORKSPACE_MEMBER
  useEffect(() => {
    if (!isLoading && filterWorkspace?.userRole === "WORKSPACE_MEMBER") {
      router.push("/admin");
    }
  }, [isLoading, filterWorkspace, router]);

  const workspace: Workspace = {
    id: filterWorkspace?.id || "",
    name: filterWorkspace?.name || "",
    description: filterWorkspace?.description || "",
    status: "active",
    color: "bg-blue-500",
    slug: filterWorkspace?.slug || "",
  };

  // Don't render if user is WORKSPACE_MEMBER
  if (!isLoading && filterWorkspace?.userRole === "WORKSPACE_MEMBER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <WorkspaceHeader workspace={workspace} />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="flex space-x-4">
              {tablist.map((tab) => (
                <TabsTrigger value={tab.value} key={tab.value}>
                  <tab.icons className="h-4 w-4 mr-2" /> {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link
                href={`/dashboard/workspace/${workspace.slug}`}
                target="_blank"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Open Workspace
              </Link>
            </Button>
          </div>{" "}
          {tablist.map((tab) => (
            <TabsContent value={tab.value} key={tab.value}>
              {tab.value === "general" && <GeneralTab />}
              {tab.value === "members" && (
                <MembersTab members={members} setMembers={setMembers} />
              )}
              {tab.value === "llm" && <LLMSettingsTab />}
              {tab.value === "knowledgebase" && <KnowledgebaseTab />}
              {tab.value === "integrations" && (
                <IntegrationLists isAdminPanel={true} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
