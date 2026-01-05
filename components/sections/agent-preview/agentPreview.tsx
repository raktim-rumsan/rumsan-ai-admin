"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrgSettings } from "@/queries/orgSettingsQuery";
import { useUpdateSystemPrompt } from "@/queries/orgSettingsQuery";

export default function AgentPreview() {
  const defaultPrompt = `## Task
Explain the task that the Agent will be performing and what tools will be needed.
Example: Lead Generation

### Description
Describe how the Agent should complete its task.
Example: Engage with website visitors by answering their inquiries about our company and services using the provided documents.
Use the 'Airtable' tool to store this information in our company CRM.

#### Examples
Provide example prompts along with the response that you want to see for each prompt.
Example:
Q: What services do you offer?
A: We specialize in AI Agent development, primarily through our platform Agentive. If you're interested in building AI agents for your business please provide some information on the project you have in mind.
Alternatively, if you'd like to speak to our team for a consultation you can provide your name and email and we'll be in touch to book in a call.`;
  const [activeTab, setActiveTab] = useState("Prompt");
  const [documentsEnabled, setDocumentsEnabled] = useState(true);
  const [promptContent, setPromptContent] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { workSpaceSlug } = useParams();

  // Get organization settings and update mutation
  const { data: orgSettings, isLoading: isOrgLoading } = useOrgSettings(
    workSpaceSlug as string
  );
  const updateSystemPrompt = useUpdateSystemPrompt(workSpaceSlug as string);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load prompt content from org settings when available
  useEffect(() => {
    if (!isMounted) return; // Don't run on server

    if (orgSettings?.systemPrompt) {
      setPromptContent(orgSettings.systemPrompt);
    } else if (!isOrgLoading && !orgSettings?.systemPrompt) {
      // Set default content if no system prompt exists
      setPromptContent(defaultPrompt);
    }
  }, [orgSettings, isOrgLoading, isMounted, defaultPrompt]);

  // Handle save button click
  const handleSave = () => {
    updateSystemPrompt.mutate({
      systemPrompt: promptContent,
    });
  };

  // Handle reset button click
  const handleReset = () => {
    setPromptContent("");
  };

  return (
    <div className="flex flex-col bg-background h-full overflow-hidden ">
      <div className="border-b border-border p-6 shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">
          Prompt Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Test your AI before release
        </p>
      </div>

      <div className="flex-1 p-6 overflow-hidden max-w-6xl ">
        <div className="h-full  overflow-hidden">
          {/* Agent Configuration Section */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit shrink-0">
              {["Prompt", "Knowledge"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium rounded-md transition-colors ",
                    activeTab === tab
                      ? "bg-background text-foreground border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "Prompt" && (
              <>
                <div className="bg-muted/50 rounded-lg border border-border p-4 flex-1 min-h-0 overflow-hidden shrink-0">
                  <Textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    className="h-full font-mono text-sm resize-none border-0 p-0 focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder={
                      isOrgLoading ? "Loading prompt..." : defaultPrompt
                    }
                    disabled={isOrgLoading}
                  />
                </div>

                <div className="mt-6 flex items-center justify-end shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground w-3xs"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2  ml-4 w-3xs"
                    onClick={handleSave}
                    disabled={
                      updateSystemPrompt.isPending || !promptContent.trim()
                    }
                  >
                    {updateSystemPrompt.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "Knowledge" && (
              <div className="bg-background rounded-lg border border-border p-6 flex-1 min-h-0 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Document Data Usage
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Enable Documents
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Allow the agent to use uploaded documents as knowledge
                          base
                        </p>
                      </div>
                      <Switch
                        checked={documentsEnabled}
                        onCheckedChange={setDocumentsEnabled}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="justify-between p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium text-foreground">
                            Notes
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Documents uploaded in one workspace wont be
                            available in the another workspace
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
