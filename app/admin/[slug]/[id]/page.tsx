"use client";

import { use, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bot, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Doc, Member, Workspace } from "@/types/workspace-types";
import MembersTab from "@/components/workspace-management/members-tabs";
import LLMSettingsTab from "@/components/workspace-management/llm-settings-tabs";
import KnowledgebaseTab from "@/components/workspace-management/knowledegebase-tabs";
import WorkspaceHeader from "@/components/workspace-management/workspace-header";

export default function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = use(params);
  const [members, setMembers] = useState<Member[]>([]); // fill initial data as needed
  //   const [llmSettings, setLlmSettings] = useState<LLMSettings[]>([]);
  const [llmSettings, setLlmSettings] = useState({
    provider: "openai",
    model: "gpt-4",
    temperature: "0.7",
    maxTokens: "2048",
    apiKey: "sk-••••••••••••••••••••",
    apiEndpoint: "",
  });

  const [knowledgebase, setKnowledgebase] = useState<Doc[]>([]);

  const workspace: Workspace = {
    id: workspaceId,
    name: "Customer Support",
    description: "AI assistant for customer inquiries and support tickets",
    status: "active",
    color: "bg-blue-500",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <WorkspaceHeader workspace={workspace} />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" /> Members
              </TabsTrigger>
              <TabsTrigger value="llm">
                <Bot className="h-4 w-4 mr-2" /> LLM Settings
              </TabsTrigger>
              <TabsTrigger value="knowledgebase">
                <FileText className="h-4 w-4 mr-2" /> Knowledgebase
              </TabsTrigger>
            </TabsList>
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href={`/dashboard/viewer?workspace=${workspaceId}`}>
                <ExternalLink className="h-4 w-4 mr-2" /> Open Workspace
              </Link>
            </Button>
          </div>

          <TabsContent value="members">
            <MembersTab members={members} setMembers={setMembers} />
          </TabsContent>
          <TabsContent value="llm">
            <LLMSettingsTab
              llmSettings={llmSettings}
              setLlmSettings={setLlmSettings}
            />
          </TabsContent>
          <TabsContent value="knowledgebase">
            <KnowledgebaseTab
              knowledgebase={knowledgebase}
              setKnowledgebase={setKnowledgebase}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
