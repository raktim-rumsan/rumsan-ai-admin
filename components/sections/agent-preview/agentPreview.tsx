"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentPreview() {
  const [activeTab, setActiveTab] = useState("Prompt");
  const [chatMessage, setChatMessage] = useState("");
  const [documentsEnabled, setDocumentsEnabled] = useState(true);
  const [promptContent, setPromptContent] = useState(`    
## Task
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
Alternatively, if you'd like to speak to our team for a consultation you can provide your name and email and we'll be in touch to book in a call.`);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-semibold text-foreground">Agent Preview</h1>
        <p className="text-muted-foreground mt-1">Test your AI before release</p>
      </div>

      <div className="flex-1 p-6">
        <div className="h-full grid grid-cols-2 gap-6">
          {/* Left Column - Agent Configuration */}
          <div className="flex flex-col">
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
              {["Prompt", "Knowledge"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium rounded-md transition-colors",
                    activeTab === tab
                      ? "bg-background text-foreground border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Model:</label>
                  <Select defaultValue="gpt-4.1">
                    <SelectTrigger className="w-48 bg-background border-border">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT 4o Mini</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div> */}

            {activeTab === "Prompt" && (
              <>
                <div className="bg-muted/50 rounded-lg border border-border p-1 flex-1 relative">
                  <Textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    className="h-full font-mono text-sm resize-none border-0 p-0 focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your prompt instructions..."
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 flex-1 ml-4">
                    Save
                  </Button>
                </div>
              </>
            )}

            {activeTab === "Knowledge" && (
              <div className="bg-background rounded-lg border border-border p-6 flex-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Document Data Usage
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Enable Documents</p>
                        <p className="text-sm text-muted-foreground">
                          Allow the agent to use uploaded documents as knowledge base
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
                          <p className="text-sm font-medium text-foreground">Notes</p>
                          <p className="text-sm text-muted-foreground">
                            Documents uploaded in one workspace wont be available in the another
                            workspace
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="flex flex-col bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-end items-center p-4 border-b border-border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>New Chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex-1 p-6"></div>

            <div className="border-t border-border p-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
