"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Zap,
  Clock,
  Globe,
  Bot,
  Send,
  ChevronDown,
  Box,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BankConfig, banks } from "@/lib/customize-bank-data";
import { CustomizationPanel } from "./customize-chatbot-pannel";

// Animation states for the expand/collapse transition
type AnimationPhase = "idle" | "expanding" | "expanded" | "collapsing";

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
}

export function UpdatedHeroSection() {
  const [selectedBank, setSelectedBank] = useState<BankConfig | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your Rumsan AI Assistant.",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Draft state (what user edits in the form)
  const [draftName, setDraftName] = useState("");
  const [draftAssistantName, setDraftAssistantName] = useState("");
  const [draftTagline, setDraftTagline] = useState("");
  const [draftColor, setDraftColor] = useState("");
  const [draftLogo, setDraftLogo] = useState<string | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<string[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [draftBotIcon, setDraftBotIcon] = useState("🤖");
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [enabledPdfs, setEnabledPdfs] = useState<boolean[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Saved state (what displays in the chatbot preview)
  const [savedName, setSavedName] = useState("");
  const [savedAssistantName, setSavedAssistantName] = useState("");
  const [savedTagline, setSavedTagline] = useState("");
  const [savedColor, setSavedColor] = useState("");
  const [savedLogo, setSavedLogo] = useState<string | null>(null);
  const [savedQuestions, setSavedQuestions] = useState<string[]>([]);
  const [savedBotIcon, setSavedBotIcon] = useState("🤖");

  // Enabled documents state (toggled from available backend documents)
  const [enabledDocuments, setEnabledDocuments] = useState<string[]>([]);

  // Chatbot preview uses saved values
  const currentBankName =
    savedName || selectedBank?.name || "Rumsan Banking Assistant";
  const currentTagline =
    savedTagline ||
    selectedBank?.tagline ||
    "Ask about our banking services here";
  const currentColor = savedColor || selectedBank?.primaryColor || "#1a1a1a";
  const currentLogo = savedLogo;
  const currentQuestions =
    savedQuestions.length > 0
      ? savedQuestions
      : selectedBank?.quickQuestions || [
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
    // Set both draft and saved values when selecting a new bank
    setDraftName(bank.name);
    setDraftAssistantName(bank.name);
    setDraftTagline(bank.tagline);
    setDraftColor(bank.primaryColor);
    setDraftQuestions(bank.quickQuestions);
    setDraftLogo(null);
    setDraftBotIcon("🤖");
    setUploadedPdfs([]);
    setEnabledPdfs([]);
    // Set saved values too (so preview shows bank defaults)
    setSavedName(bank.name);
    setSavedAssistantName(bank.name);
    setSavedTagline(bank.tagline);
    setSavedColor(bank.primaryColor);
    setSavedLogo(null);
    setSavedQuestions(bank.quickQuestions);
    setSavedBotIcon("🤖");
    setMessages([
      {
        id: Date.now().toString(),
        content: `Hello! I'm your ${bank.name}. How can I help you today?`,
        sender: "bot",
      },
    ]);
  };

  const handleStartCustomizing = () => {
    if (selectedBank) {
      // Start expansion animation - panel reveals from right
      setAnimationPhase("expanding");
      setTimeout(() => {
        setIsCustomizing(true);
        setAnimationPhase("idle");
      }, 900);
    }
  };

  const handleExitCustomizing = () => {
    // Start collapse animation - panel collapses to right
    setAnimationPhase("collapsing");
    // After animation completes, reset to idle
    setTimeout(() => {
      setIsCustomizing(false);
      setAnimationPhase("idle");
    }, 500);
  };

  const handleSaveConfiguration = () => {
    // Apply draft values to saved values
    setSavedName(draftName);
    setSavedAssistantName(draftAssistantName);
    setSavedTagline(draftTagline);
    setSavedColor(draftColor);
    setSavedLogo(draftLogo);
    setSavedQuestions(draftQuestions);
    setSavedBotIcon(draftBotIcon);
    toast.success(`Configuration saved for ${draftName}!`);
  };

  const handleResetConfiguration = () => {
    if (selectedBank) {
      // Reset draft values to bank defaults
      setDraftName(selectedBank.name);
      setDraftAssistantName(selectedBank.name);
      setDraftTagline(selectedBank.tagline);
      setDraftColor(selectedBank.primaryColor);
      setDraftLogo(null);
      setDraftQuestions(selectedBank.quickQuestions);
      setUploadedPdf(null);
      setDraftBotIcon("🤖");
      setUploadedPdfs([]);
      setEnabledPdfs([]);
      setEnabledDocuments([]);
      // Also reset saved values
      setSavedName(selectedBank.name);
      setSavedAssistantName(selectedBank.name);
      setSavedTagline(selectedBank.tagline);
      setSavedColor(selectedBank.primaryColor);
      setSavedLogo(null);
      setSavedQuestions(selectedBank.quickQuestions);
      setSavedBotIcon("🤖");
    }
  };

  const handleToggleDocument = (docId: string) => {
    setEnabledDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const handlePdfUpload = (file: File | null) => {
    if (file) {
      setUploadedPdfs((prev) => [...prev, file]);
      setEnabledPdfs((prev) => [...prev, true]);
    }
  };

  const handleRemovePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
    setEnabledPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePdf = (index: number) => {
    setEnabledPdfs((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleResetToOriginal = () => {
    // Reset to original state (no bank selected)
    setSelectedBank(null);
    setShowBankSelector(false);
    setDraftName("");
    setDraftAssistantName("");
    setDraftTagline("");
    setDraftColor("");
    setDraftLogo(null);
    setDraftQuestions([]);
    setUploadedPdf(null);
    setDraftBotIcon("🤖");
    setUploadedPdfs([]);
    setEnabledPdfs([]);
    setEnabledDocuments([]);
    // Reset saved values
    setSavedName("");
    setSavedAssistantName("");
    setSavedTagline("");
    setSavedColor("");
    setSavedLogo(null);
    setSavedQuestions([]);
    setSavedBotIcon("🤖");
    // Reset messages
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your Rumsan AI Assistant.",
        sender: "bot",
      },
    ]);
  };

  // Chatbot component (reused in both modes)
  const ChatbotWidget = ({ expanded = false }: { expanded?: boolean }) => {
    const isExpanding = animationPhase === "expanding";
    const isCollapsing = animationPhase === "collapsing";
    const showBackButton = isCustomizing || isExpanding;
    const showPanel = (isCustomizing || isExpanding) && !isCollapsing;

    return (
      <div
        className={cn(
          "overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          expanded
            ? "w-full h-full"
            : cn(
                "w-full",
                showPanel
                  ? "lg:h-[30px] h-[calc(100vh-200px)] min-h-[500px] max-h-[700px]"
                  : "h-[calc(100vh-200px)] min-h-[500px] max-h-[700px]",
              ),
        )}
      >
        {/* Header with Bank Selector */}
        <div
          className="flex items-center gap-3 px-4 py-3 text-white relative shrink-0"
          style={{ backgroundColor: currentColor }}
        >
          {/* Back button - shows during expansion and customization, fades out when collapsing */}
          <div
            className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
              showBackButton && !isCollapsing
                ? "w-8 opacity-100"
                : "w-0 opacity-0",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleExitCustomizing}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 shrink-0">
            {currentLogo ? (
              <img
                src={currentLogo || "/placeholder.svg"}
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            ) : (
              <Box className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{currentBankName}</h3>
            <p className="text-xs opacity-80 truncate">{currentTagline}</p>
          </div>

          {/* Switch and Customize buttons - hide during expansion */}
          <div
            className={cn(
              "flex items-center gap-1 shrink-0 transition-all duration-300 ease-out",
              selectedBank && !isCustomizing && animationPhase !== "expanding"
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden",
            )}
          >
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 text-xs px-2 h-7"
                onClick={() => setShowBankSelector(!showBankSelector)}
                title="Switch to a different bank"
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 mr-1 transition-transform",
                    showBankSelector && "rotate-180",
                  )}
                />
                Switch
              </Button>

              {/* Switch Bank Dropdown */}
              {showBankSelector && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card rounded-xl border shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      {/* Back to Original Option */}
                      <button
                        onClick={handleResetToOriginal}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left border border-transparent hover:bg-muted hover:border-border"
                      >
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground shrink-0">
                          <ArrowLeft className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Back to Original
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Reset to default
                          </p>
                        </div>
                      </button>

                      <div className="border-t my-1.5" />

                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleBankSelect(bank)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left bg-muted/50 hover:bg-muted border border-transparent hover:border-border group",
                          )}
                        >
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform"
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
                          {selectedBank?.id === bank.id && (
                            <div className="text-primary text-sm">✓</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 text-xs px-2 h-7"
              onClick={handleStartCustomizing}
            >
              Customize
            </Button>
          </div>
        </div>

        {/* Main Content Area - Chat and Panel side by side */}
        <div
          className={cn(
            "flex flex-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            showPanel ? "lg:min-h-[30px]" : "min-h-0",
          )}
        >
          {/* Left - Chat Messages Area - Expands to cover panel when collapsing */}
          <div
            className={cn(
              "flex flex-col flex-1 min-w-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              showPanel && !isCollapsing
                ? "border-r border-border"
                : "border-r-0",
              isCollapsing && "flex-[2]",
            )}
          >
            <div
              className={cn(
                "flex justify-center shrink-0",
                expanded ? "py-8" : "py-6",
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "rounded-2xl flex items-center justify-center",
                    expanded ? "h-20 w-20" : "h-16 w-16",
                  )}
                  style={{ backgroundColor: `${currentColor}15` }}
                >
                  <Bot
                    className={cn(expanded ? "h-10 w-10" : "h-8 w-8")}
                    style={{ color: currentColor }}
                  />
                </div>
                <div
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-card"
                  style={{ backgroundColor: "#22d3ee" }}
                />
              </div>
            </div>

            {/* Messages */}
            <div
              className={cn(
                "px-4 space-y-3 overflow-y-auto flex-1",
                expanded ? "min-h-[200px]" : "min-h-[150px]",
              )}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    message.sender === "user" ? "ml-auto flex-row-reverse" : "",
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
            <div className="px-4 py-4 shrink-0">
              <p className="text-xs text-muted-foreground mb-2">
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentQuestions
                  .slice(0, expanded ? 4 : 2)
                  .map((question, index) => (
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
            <div className="p-4 pt-0 shrink-0">
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
                This information is for informational and educational purposes
                only.
              </p>
            </div>
          </div>

          {/* Right - Customization Panel (inside chatbot container) - Smoothly slides out when collapsing */}
          <div
            className={cn(
              "overflow-hidden shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              showPanel ? "w-[380px] opacity-100" : "w-0 opacity-0",
              isCollapsing && "translate-x-[100px]",
            )}
          >
            <div
              className={cn(
                "w-[380px] h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isCollapsing && "opacity-0 translate-x-8",
              )}
            >
              <CustomizationPanel
                bankName={draftName}
                assistantName={draftAssistantName}
                tagline={draftTagline}
                primaryColor={draftColor}
                quickQuestions={draftQuestions}
                onNameChange={setDraftName}
                onAssistantNameChange={setDraftAssistantName}
                onTaglineChange={setDraftTagline}
                onColorChange={setDraftColor}
                onLogoChange={setDraftLogo}
                onQuickQuestionsChange={setDraftQuestions}
                onPdfUpload={handlePdfUpload}
                uploadedPdf={uploadedPdf}
                logoUrl={draftLogo}
                onSave={handleSaveConfiguration}
                onReset={handleResetConfiguration}
                availableDocuments={selectedBank?.availableDocuments || []}
                enabledDocuments={enabledDocuments}
                onToggleDocument={handleToggleDocument}
                selectedBotIcon={draftBotIcon}
                onBotIconChange={setDraftBotIcon}
                uploadedPdfs={uploadedPdfs}
                onRemovePdf={handleRemovePdf}
                enabledPdfs={enabledPdfs}
                onTogglePdf={handleTogglePdf}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Default hero layout (unified - chatbot expands with panel)
  const showPanel =
    (isCustomizing || animationPhase === "expanding") &&
    animationPhase !== "collapsing";

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left Content - Collapses during expansion */}
          <div
            className={cn(
              "flex-1 w-full lg:w-1/2 transition-all duration-500 ease-out",
              (animationPhase === "expanding" ||
                (isCustomizing && animationPhase !== "collapsing")) &&
                cn(
                  "lg:w-0 lg:min-w-0 lg:opacity-0 lg:overflow-hidden lg:mr-0 lg:gap-0",
                  showPanel ? "lg:h-0" : "lg:h-0",
                ),
            )}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 mb-8">
              <Zap className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-700">
                No Code Required
              </span>
              <span className="text-cyan-400">•</span>
              <span className="text-sm font-medium text-cyan-700">
                AI-Powered
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Create & Deploy Your{" "}
              <span className="text-cyan-500">AI Banking Assistant</span>{" "}
              Without Writing Any Code
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              No coding, no complexity. Just upload your documents, train your
              AI, and deploy across web, slack, and WhatsApp in minutes. Reduce
              call-center workload and deliver instant banking support 24/7.
            </p>
          </div>

          {/* Right Content - Chatbot with Expansion Animation */}
          <div
            className={cn(
              "flex transition-all duration-500 ease-out",
              (isCustomizing || animationPhase === "expanding") &&
                animationPhase !== "collapsing"
                ? "w-full justify-center"
                : "w-full lg:w-1/2 justify-center lg:justify-end",
            )}
          >
            {/* Expandable Card Container - Expands to fit panel, smoothly shrinks when collapsing */}
            <div
              className={cn(
                "relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                (isCustomizing || animationPhase === "expanding") &&
                  animationPhase !== "collapsing"
                  ? "w-full max-w-[860px]"
                  : "w-full max-w-[480px]",
              )}
            >
              {/* Blurred overlay when no bank selected */}
              {!selectedBank && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px] rounded-2xl">
                  <div className="w-full px-4">
                    {/* Glassmorphism Card */}
                    <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-6">
                      {/* Header */}
                      <div className="text-center mb-5">
                        <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          Get Started
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Select your bank to unlock the AI assistant
                        </p>
                      </div>

                      {/* Choose Your Bank Button (default state) */}
                      {!showBankSelector && (
                        <Button
                          size="lg"
                          className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-11 shadow-lg"
                          onClick={() => setShowBankSelector(true)}
                        >
                          Choose Your Bank
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      )}

                      {/* Bank Options List (shown when dropdown is open) */}
                      {showBankSelector && (
                        <div className="space-y-3">
                          <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                            {banks.map((bank) => (
                              <button
                                key={bank.id}
                                onClick={() => handleBankSelect(bank)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left bg-muted/50 hover:bg-muted border border-transparent hover:border-border group",
                                )}
                              >
                                <div
                                  className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform"
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
                                <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowBankSelector(false)}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Chatbot Card Container - Panel expands from within */}
              <div
                className={cn(
                  "bg-card rounded-2xl border shadow-xl overflow-hidden transition-all duration-500 ease-out",
                  !selectedBank && "pointer-events-none select-none",
                )}
              >
                <ChatbotWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
