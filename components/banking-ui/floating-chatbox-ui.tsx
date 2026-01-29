"use client";

import { useState, useEffect } from "react";
import { Bot, Send, ChevronDown, X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BankConfig } from "@/lib/customize-bank-data";

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
}

interface FloatingChatbotProps {
  onSelectBank: (bank: BankConfig) => void;
  customColor?: string;
  customAssistantName?: string;
}

export function FloatingChatbot({
  onSelectBank,
  customColor,
  customAssistantName: externalAssistantName,
}: FloatingChatbotProps) {
  const [selectedBank, setSelectedBank] = useState<BankConfig | null>(null);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [customAssistantName, setCustomAssistantName] =
    useState("AI Assistant");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm your ${
        externalAssistantName || "AI Assistant"
      }. How can I help you today?`,
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Update assistant name when external prop changes
  useEffect(() => {
    if (externalAssistantName) {
      setCustomAssistantName(externalAssistantName);
      setMessages([
        {
          id: "1",
          content: `Hello! I'm your ${externalAssistantName}. How can I help you today?`,
          sender: "bot",
        },
      ]);
    }
  }, [externalAssistantName]);

  const currentBankName = selectedBank?.name || "Rumsan Banking Assistant";
  const currentTagline =
    selectedBank?.tagline || "Ask about our banking services here";
  const currentColor = customColor || selectedBank?.primaryColor || "#1a1a1a";
  const currentQuestions = selectedBank?.quickQuestions || [
    "How do I open a bank account?",
    "What is the bank's loan interest rate?",
  ];

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `Thank you for your question. This is a demo response from ${currentBankName}.`,
      sender: "bot",
    };

    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInputValue("");
  };

  const handleBankSelect = (bank: BankConfig) => {
    setSelectedBank(bank);
    setShowBankSelector(false);
    setCustomAssistantName(bank.name);
    setMessages([
      {
        id: Date.now().toString(),
        content: `Hello! I'm your ${bank.name}. How can I help you today?`,
        sender: "bot",
      },
    ]);
  };

  // Declare readyBanks and comingSoonBanks variables
  const readyBanks = banks.filter((bank) => bank.status === "ready");
  const comingSoonBanks = banks.filter((bank) => bank.status === "comingSoon");

  return (
    <div className="w-full max-w-[400px] bg-card rounded-2xl border shadow-xl overflow-hidden">
      {/* Header with Bank Selector */}
      <div
        className="flex items-center gap-3 px-4 py-3 text-white relative"
        style={{ backgroundColor: currentColor }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <Box className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setShowBankSelector(!showBankSelector)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <h3 className="font-medium truncate">{currentBankName}</h3>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showBankSelector && "rotate-180"
              )}
            />
          </button>
          <p className="text-xs opacity-80 truncate">{currentTagline}</p>
        </div>

        {selectedBank && (
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 text-xs px-2 h-7"
            onClick={() => onSelectBank(selectedBank)}
          >
            Customize
          </Button>
        )}

        {/* Bank Selector Dropdown */}
        {showBankSelector && (
          <div className="absolute top-full left-0 right-0 bg-card border-t shadow-lg z-10 max-h-[320px] overflow-y-auto">
            <div className="p-2">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left",
                    selectedBank?.id === bank.id && "bg-muted"
                  )}
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: bank.primaryColor }}
                  >
                    {bank.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {bank.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {bank.tagline}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center py-6">
        <div className="relative">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${currentColor}15` }}
          >
            <Bot className="h-8 w-8" style={{ color: currentColor }} />
          </div>
          <div
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-card"
            style={{ backgroundColor: "#22d3ee" }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 space-y-3 min-h-[80px] max-h-[200px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 max-w-[85%]",
              message.sender === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {message.sender === "bot" && (
              <div className="rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground">
                {message.content}
              </div>
            )}
            {message.sender === "user" && (
              <div
                className="rounded-xl px-4 py-2.5 text-sm text-white"
                style={{ backgroundColor: currentColor }}
              >
                {message.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground mb-2">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {currentQuestions.slice(0, 2).map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className="text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition-colors truncate max-w-full"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 pt-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2 border rounded-lg px-3 py-2"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">
          This information is for informational and educational purposes only.
        </p>
      </div>
    </div>
  );
}
