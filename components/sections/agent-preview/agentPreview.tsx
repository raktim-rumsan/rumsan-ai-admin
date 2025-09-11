"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Send, RotateCcw, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrg } from "@/providers/OrgProvider";
import { useUpdateSystemPrompt } from "@/queries/orgSettingsQuery";
import { useChatMutation, ChatMessage } from "@/queries/chatQuery";

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
  const [chatMessage, setChatMessage] = useState("");
  const [documentsEnabled, setDocumentsEnabled] = useState(true);
  const [promptContent, setPromptContent] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get organization settings and update mutation
  const { orgSettings, isLoading: isOrgLoading } = useOrg();
  const updateSystemPrompt = useUpdateSystemPrompt();
  const chatMutation = useChatMutation();

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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isThinking]);

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

  // Handle sending chat message
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatMessage.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setChatMessages((prev) => [...prev, userMessage]);
    setChatMessage("");
    setIsThinking(true);

    try {
      // Send message to API
      const response = await chatMutation.mutateAsync({
        query: chatMessage.trim(),
      });

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        processingTime: response.processingTime,
      };

      // Add assistant message to chat
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  // Handle new chat (reset)
  const handleNewChat = () => {
    setChatMessages([]);
    setIsThinking(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-background h-full overflow-hidden">
      <div className="border-b border-border p-6 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">Agent Preview</h1>
        <p className="text-muted-foreground mt-1">Test your AI before release</p>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full grid grid-cols-2 gap-6 overflow-hidden">
          {/* Left Column - Agent Configuration */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit flex-shrink-0">
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
            {activeTab === "Prompt" && (
              <>
                <div className="bg-muted/50 rounded-lg border border-border p-1 flex-1 min-h-0 overflow-hidden">
                  <Textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    className="h-full font-mono text-sm resize-none border-0 p-0 focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder={isOrgLoading ? "Loading prompt..." : defaultPrompt}
                    disabled={isOrgLoading}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 flex-1 ml-4"
                    onClick={handleSave}
                    disabled={updateSystemPrompt.isPending}
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
          <div className="flex flex-col bg-muted/30 rounded-lg border border-border h-full min-h-0 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
              <div className="text-sm font-medium text-foreground">Preview Chat</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={handleNewChat}
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

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {chatMessages.length === 0 && !isThinking && (
                <div className="text-center text-muted-foreground text-sm">
                  Start a conversation to test your agent
                </div>
              )}

              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border text-foreground"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.role === "assistant" && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-start gap-2">
                          {message.processingTime && (
                            <Badge variant="secondary" className="text-xs">
                              Time: {(message.processingTime / 1000).toFixed(2)}s
                            </Badge>
                          )}
                        </div>
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="border-t border-border pt-2 mt-2">
                            <div className="text-xs text-muted-foreground mb-1">Sources:</div>
                            <div className="space-y-1">
                              {message.sources[0].payload.fileName || "Source not defined"}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-background border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse">AI is thinking...</div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Send a message..."
                  className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isThinking}
                />
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2"
                  onClick={handleSendMessage}
                  disabled={isThinking || !chatMessage.trim()}
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
