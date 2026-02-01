"use client";

import { useState, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatbotPreviewProps {
  bankName: string;
  assistantName: string;
  tagline: string;
  primaryColor: string;
  quickQuestions: string[];
  logoUrl?: string;
  botIcon?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
}

export function ChatbotPreview({
  bankName,
  assistantName,
  tagline,
  primaryColor,
  quickQuestions,
  logoUrl,
  botIcon = "🤖",
}: ChatbotPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm your ${assistantName}. How can I help you today?`,
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Update greeting message when assistantName changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: `Hello! I'm your ${assistantName}. How can I help you today?`,
        sender: "bot",
      },
    ]);
  }, [assistantName]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `Thank you for your question about "${content}". This is a demo response from ${bankName}'s AI assistant.`,
      sender: "bot",
    };

    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
          {logoUrl ? (
            <img
              src={logoUrl || "/placeholder.svg"}
              alt={bankName}
              className="h-6 w-6 object-contain"
            />
          ) : (
            botIcon
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{bankName}</h3>
          <p className="text-xs opacity-80 truncate">{tagline}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              message.sender === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                message.sender === "user" ? "bg-muted" : ""
              )}
              style={
                message.sender === "bot"
                  ? { backgroundColor: `${primaryColor}20` }
                  : {}
              }
            >
              {message.sender === "bot" ? (
                <Bot className="h-4 w-4" style={{ color: primaryColor }} />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div
              className={cn(
                "rounded-2xl px-4 py-2 text-sm",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
              style={
                message.sender === "user"
                  ? { backgroundColor: primaryColor }
                  : {}
              }
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Questions */}
      <div className="px-4 pb-2 overflow-hidden">
        <p className="text-xs text-muted-foreground mb-2">Quick Questions:</p>
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition-colors whitespace-nowrap"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 pt-2 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            style={{ backgroundColor: primaryColor }}
            className="shrink-0 hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          This is a demo preview. Responses are simulated.
        </p>
      </div>
    </div>
  );
}
