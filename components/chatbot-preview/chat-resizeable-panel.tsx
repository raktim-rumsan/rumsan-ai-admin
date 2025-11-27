"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Bot, User, Sparkles, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChatMessage,
  clearChatHistory,
  saveChatHistory,
  useChatHistory,
  useChatMutation,
} from "@/queries/chatQuery";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";

export function ResizableChatPanel({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasHydratedFromStorage = useRef(false);
  const chatMutation = useChatMutation();
  const { data: storedMessages } = useChatHistory();
  const queryClient = useQueryClient();
  const { data: workspacesData, isLoading: isLoadingWorkspace } =
    useWorkspaceQuery();

  // Get workspace bot name from localStorage slug
  const workspaceSlug =
    typeof window !== "undefined" ? localStorage.getItem("workspaceId") : null;
  const currentWorkspace = workspacesData?.data?.myWorkspaces?.find(
    (ws) => ws.slug === workspaceSlug
  );
  const botName = currentWorkspace?.botName || "Rumsan AI";

  const createWelcomeMessageWithBotName = useCallback(
    (): ChatMessage => ({
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your ${botName}. How can I help you?`,
      timestamp: new Date(),
    }),
    [botName]
  );

  useEffect(() => {
    if (isLoadingWorkspace) return; // Wait for workspace to load

    if (
      storedMessages &&
      storedMessages.length > 0 &&
      !hasHydratedFromStorage.current
    ) {
      setMessages(storedMessages);
      hasHydratedFromStorage.current = true;
    } else if (messages.length === 0 && botName) {
      setMessages([createWelcomeMessageWithBotName()]);
    }
  }, [
    storedMessages,
    botName,
    messages.length,
    createWelcomeMessageWithBotName,
    isLoadingWorkspace,
  ]);

  useEffect(() => {
    saveChatHistory(messages);
    queryClient.setQueryData(["chatHistory"], messages);
  }, [messages, queryClient]);

  const handleClearHistory = () => {
    const welcomeMessage = createWelcomeMessageWithBotName();
    setMessages([welcomeMessage]);
    clearChatHistory();
    queryClient.setQueryData(["chatHistory"], [welcomeMessage]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await chatMutation.mutateAsync({
        query: trimmedMessage,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        processingTime: response.processingTime,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          {isLoadingWorkspace ? (
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <h2 className="text-base font-semibold text-foreground">
              {botName}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleClearHistory}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              onClick={() => {
                saveChatHistory(messages);
                queryClient.setQueryData(["chatHistory"], messages);
                onClose();
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-4 py-2.5",
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.role === "assistant" && (
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {message.processingTime !== undefined && (
                      <div>
                        Response time:{" "}
                        {(message.processingTime / 1000).toFixed(2)}s
                      </div>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="border-t border-border pt-2 mt-2">
                        <p>
                          Source: {message.sources[0].payload.fileName || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm">
                {botName} is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your account, transfers, or more..."
            className="flex-1"
            disabled={isThinking}
          />
          <Button
            onClick={() => void handleSend()}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={isThinking || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
