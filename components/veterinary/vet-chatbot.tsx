"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastUtils } from "@/lib/toast-utils";
import {
  ChatMessage,
  clearChatHistory,
  saveChatHistory,
  useChatIndustryMutation,
} from "@/queries/chatQuery";
import { Bot, PawPrint, Send } from "lucide-react";

const createWelcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your Rumsan Veterinary AI Assistant.",
  timestamp: new Date(),
});

export function VetChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const industryChatMutation = useChatIndustryMutation();

  useEffect(() => {
    clearChatHistory();
    setMessages([createWelcomeMessage()]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await industryChatMutation.mutateAsync({
        query: userMessage.content,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        processingTime: response.processingTime,
      };

      const nextMessages = [...pendingMessages, assistantMessage];
      setMessages(nextMessages);
      saveChatHistory(nextMessages);
    } catch (error) {
      console.error("Veterinary chat error:", error);
      toastUtils.generic.error(
        "Failed to fetch AI response",
        error instanceof Error ? error.message : "Unknown error"
      );

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I ran into an issue processing that question. Please try again.",
        timestamp: new Date(),
      };

      const nextMessages = [...pendingMessages, errorMessage];
      setMessages(nextMessages);
      saveChatHistory(nextMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <PawPrint className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            Rumsan Veterinary Assistant
          </h3>
          <p className="text-xs text-muted-foreground">
            Ask anything about pet health or care
          </p>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-64 w-full pr-2">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  message.role === "assistant"
                    ? "bg-accent text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 rounded-lg border border-border bg-background p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">
                    AI Assistant
                  </span>
                  <span className="text-xs text-muted-foreground">
                    thinking...
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
        <Textarea
          ref={textareaRef}
          placeholder="Type your pet care question..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 resize-none bg-transparent text-sm outline-none"
        />

        <Button
          size="icon"
          variant="ghost"
          disabled={isLoading}
          className="h-8 w-8 shrink-0"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Responses are informational only; consult your vet for urgent care.
      </p>
    </Card>
  );
}
