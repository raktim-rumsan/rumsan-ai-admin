"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
import { BankConfig } from "@/lib/customize-bank-data";
import { CustomizationPanel } from "./customize-chatbot-pannel";
import {
  useOrgBySectorQuery,
  useDocsQuery,
  sendWidgetChatQuery,
  useWorkspaceQuery,
} from "@/queries/demoSiteQuery";
import { SECTOR } from "@/constants/chatbot-demo-bank";
import { getBankApiKey } from "@/lib/utils";

// Animation states for the expand/collapse transition
type AnimationPhase = "idle" | "expanding" | "expanded" | "collapsing";

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
}

export function UpdatedHeroSection() {
  const [selectedBank, setSelectedBank] = useState<BankConfig | any>(null);
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
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const customizationMessagesContainerRef = useRef<HTMLDivElement>(null);
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef<boolean>(false);

  // Stable input change handler for default mode to prevent focus loss
  const handleDefaultInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      wasFocusedRef.current = true;
      setInputValue(e.target.value);
      // Maintain focus immediately after state update
      requestAnimationFrame(() => {
        if (defaultInputRef.current && wasFocusedRef.current) {
          defaultInputRef.current.focus();
        }
      });
    },
    [],
  );

  // Handle blur to track when input loses focus
  const handleDefaultInputBlur = useCallback(() => {
    wasFocusedRef.current = false;
  }, []);

  // Handle focus to track when input gains focus
  const handleDefaultInputFocus = useCallback(() => {
    wasFocusedRef.current = true;
  }, []);

  // Stable input change handler for customization mode
  const handleCustomizationInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

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
  // Extract workspace data if selectedBank is from API
  const selectedWorkspace = selectedBank?.workspaces?.[0];
  // Header name - always shows bank name (doesn't change with bot name)
  const currentBankName =
    savedName ||
    selectedWorkspace?.name ||
    selectedBank?.name ||
    "Rumsan Banking Assistant";
  // Bot name - used only in chatbot greeting (can be customized)
  const currentBotName =
    draftAssistantName || savedAssistantName || currentBankName;
  const currentTagline =
    savedTagline ||
    selectedWorkspace?.description ||
    selectedBank?.tagline ||
    "Ask about our banking services here";

  // Extract workspace slug and bank code from selected bank
  const selectedWorkspaceSlug = selectedBank?.workspaces?.[0]?.slug;
  const selectedBankCode = selectedBank?.workspaces?.[0]?.bankCode;

  // Get locally stored primary color for this workspace (session-based)
  const getLocalPrimaryColor = (workspaceSlug: string | undefined) => {
    if (!workspaceSlug || typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem(`primaryColor_${workspaceSlug}`);
      return stored || null;
    } catch {
      return null;
    }
  };

  const localPrimaryColor = getLocalPrimaryColor(selectedWorkspaceSlug);

  // Use draftColor for live preview, fallback to saved/other sources
  const currentColor =
    draftColor ||
    savedColor ||
    localPrimaryColor ||
    selectedWorkspace?.primaryColor ||
    selectedBank?.primaryColor ||
    "#1a1a1a";
  const currentLogo = savedLogo || selectedWorkspace?.url || null;
  const currentQuestions =
    savedQuestions?.length > 0
      ? savedQuestions
      : selectedWorkspace?.quickQuestions ||
        selectedBank?.quickQuestions || [
          "How do I open a bank account?",
          "What is the bank's loan interest rate?",
        ];
  //fetch organizations
  const { data } = useOrgBySectorQuery(SECTOR, "NMB");
  console.log("data ==>", data, data?.data[0]);

  //fetch documents - only after a bank is selected
  const {
    data: docs,
    isPending: isDocsPending,
    refetch: refetchDocs,
  } = useDocsQuery(selectedWorkspaceSlug, selectedBankCode);

  //fetch workspaces to get bot name - only after a bank is selected
  // React Query will automatically refetch when selectedBankCode changes (query key changes)
  const { data: workspaceData } = useWorkspaceQuery(selectedBankCode);

  // Extract bot name from workspace data when bank is selected
  useEffect(() => {
    if (workspaceData?.data?.myWorkspaces && selectedWorkspaceSlug) {
      const workspace = workspaceData.data.myWorkspaces.find(
        (w: any) => w.slug === selectedWorkspaceSlug,
      );
      if (workspace?.botName) {
        // Set the bot name from API to saved state
        setSavedAssistantName(workspace.botName);
        // Also update draft if user hasn't customized it yet
        // Only update if draftAssistantName is empty or matches the bank name (not customized)
        const currentDraft = draftAssistantName || savedAssistantName;
        const bankName = selectedWorkspace?.name || selectedBank?.name;
        if (!currentDraft || currentDraft === bankName) {
          setDraftAssistantName(workspace.botName);
        }
      } else if (workspace && !workspace.botName) {
        // If workspace exists but no botName, fallback to bank name
        const bankName = workspace.name || selectedBank?.name;
        if (bankName && !savedAssistantName) {
          setSavedAssistantName(bankName);
          if (!draftAssistantName || draftAssistantName === bankName) {
            setDraftAssistantName(bankName);
          }
        }
      }
    }
  }, [
    workspaceData,
    selectedWorkspaceSlug,
    selectedWorkspace?.name,
    selectedBank?.name,
    draftAssistantName,
    savedAssistantName,
  ]);

  const workspaceSlug = selectedWorkspaceSlug;
  console.log("workspaceSlug ==>", workspaceSlug);
  if (docs) {
    console.log("docs", docs);
  }

  // Update greeting message when bot name changes
  useEffect(() => {
    if (currentBotName && messages.length > 0 && messages[0].sender === "bot") {
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[0] && newMessages[0].sender === "bot") {
          newMessages[0] = {
            ...newMessages[0],
            content: `Hello! I'm your ${currentBotName}. How can I help you today?`,
          };
        }
        return newMessages;
      });
    }
  }, [currentBotName]);

  // Save primary color to sessionStorage when draftColor changes (debounced)
  useEffect(() => {
    if (selectedWorkspaceSlug && draftColor && typeof window !== "undefined") {
      const timeoutId = setTimeout(() => {
        try {
          sessionStorage.setItem(
            `primaryColor_${selectedWorkspaceSlug}`,
            draftColor,
          );
        } catch {
          // Ignore storage errors
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [draftColor, selectedWorkspaceSlug]);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Scroll default view messages container
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    // Scroll customization mode messages container
    if (customizationMessagesContainerRef.current) {
      customizationMessagesContainerRef.current.scrollTo({
        top: customizationMessagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoadingMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoadingMessage) return;

    // Only send if bank is selected
    if (!selectedBank || !selectedWorkspaceSlug || !selectedBankCode) {
      toast.error("Please select a bank first");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoadingMessage(true);

    try {
      const apiKey = getBankApiKey(selectedBankCode);
      if (!apiKey) {
        throw new Error("API key not found for selected bank");
      }

      const response = await sendWidgetChatQuery(
        content.trim(),
        apiKey,
        selectedWorkspaceSlug,
      );

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer || "Sorry, I couldn't process your request.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          error instanceof Error
            ? error.message
            : "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get response");
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleBankSelect = (bank: BankConfig | any) => {
    // Handle both BankConfig type and API organization data
    let workspace: any = null;
    let bankName: string;
    let tagline: string;
    let primaryColor: string;
    let quickQuestions: string[];

    // Check if it's API data (has workspaces array)
    if (
      bank.workspaces &&
      Array.isArray(bank.workspaces) &&
      bank.workspaces.length > 0
    ) {
      workspace = bank.workspaces[0];
      bankName = workspace.name;
      tagline = workspace.description || "Ask about our banking services here";
      // Use enriched data from API (quickQuestions and primaryColor from workspace)
      primaryColor = workspace.primaryColor || "#1a1a1a";
      quickQuestions = workspace.quickQuestions || [
        "How do I open a bank account?",
        "What is the bank's loan interest rate?",
      ];
    } else {
      // Fallback to BankConfig type
      bankName = bank.name;
      tagline = bank.tagline;
      primaryColor = bank.primaryColor;
      quickQuestions = bank.quickQuestions;
    }

    setSelectedBank(bank);
    setShowBankSelector(false);

    // Check for locally stored primary color for this workspace
    const workspaceSlug = workspace?.slug;
    let colorToUse = primaryColor;
    if (workspaceSlug && typeof window !== "undefined") {
      try {
        const storedColor = sessionStorage.getItem(
          `primaryColor_${workspaceSlug}`,
        );
        if (storedColor) {
          colorToUse = storedColor;
        }
      } catch {
        // Ignore storage errors
      }
    }

    // Set both draft and saved values when selecting a new bank
    setDraftName(bankName);
    setDraftAssistantName(bankName);
    setDraftTagline(tagline);
    setDraftColor(colorToUse);
    setDraftQuestions(quickQuestions);
    setDraftLogo(workspace?.url || null);
    setDraftBotIcon("🤖");
    setUploadedPdfs([]);
    setEnabledPdfs([]);
    setEnabledDocuments([]);
    setSavedName(bankName);
    setSavedTagline(tagline);
    setSavedColor(colorToUse);
    setSavedQuestions(quickQuestions);
    setSavedLogo(
      `${process.env.NEXT_PUBLIC_SERVER_API}/${workspace?.url?.replace(
        /^uploads\//,
        "assets/",
      )}` || null,
    );
    setSavedBotIcon("🤖");
    setMessages([
      {
        id: Date.now().toString(),
        content: `Hello! I'm your ${bankName}. How can I help you today?`,
        sender: "bot",
      },
    ]);
    // Refetch documents when a bank is selected
    // Workspaces will automatically refetch when selectedBankCode changes (via query key)
    if (workspace?.slug) {
      // Small delay to ensure state is updated first
      setTimeout(() => {
        refetchDocs();
      }, 100);
    }
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

    // Save primary color to sessionStorage for this workspace
    if (selectedWorkspaceSlug && draftColor && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          `primaryColor_${selectedWorkspaceSlug}`,
          draftColor,
        );
      } catch {
        // Ignore storage errors
      }
    }

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
      setUploadedPdf(file);
      setUploadedPdfs([file]);
      setEnabledPdfs([true]);
    } else {
      setUploadedPdf(null);
      setUploadedPdfs([]);
      setEnabledPdfs([]);
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

  // Compute animation states
  const isExpanding = animationPhase === "expanding";
  const isCollapsing = animationPhase === "collapsing";
  const showBackButton = isCustomizing || isExpanding;
  const showPanel = (isCustomizing || isExpanding) && !isCollapsing;

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
                  ? "w-full max-w-[900px]"
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
                            {data?.data?.map((bank: any) => {
                              const workspace = bank.workspaces?.[0];
                              return (
                                <button
                                  key={bank.id}
                                  onClick={() => handleBankSelect(bank)}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left bg-muted/50 hover:bg-muted border border-transparent hover:border-border group",
                                  )}
                                >
                                  <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform"
                                    style={{
                                      backgroundColor:
                                        workspace?.primaryColor || "#1a1a1a",
                                    }}
                                  >
                                    {workspace?.name?.charAt(0) || "B"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {workspace?.name || bank.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {workspace?.description ||
                                        "Banking services"}
                                    </p>
                                  </div>
                                  <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              );
                            })}
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
                <div
                  className={cn(
                    "overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showPanel
                      ? "h-[calc(100vh-200px)] min-h-[600px] max-h-[800px]"
                      : "h-[calc(100vh-200px)] min-h-[500px] max-h-[700px]",
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
                        <Image
                          src={currentLogo || "/placeholder.svg"}
                          alt="Logo"
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <Box className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {currentBankName}
                      </h3>
                      <p className="text-xs opacity-80 truncate">
                        {currentTagline}
                      </p>
                    </div>

                    {/* Switch and Customize buttons - hide during expansion */}
                    <div
                      className={cn(
                        "flex items-center gap-1 shrink-0 transition-all duration-300 ease-out",
                        selectedBank &&
                          !isCustomizing &&
                          animationPhase !== "expanding"
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

                                {data?.data?.map((bank: any) => {
                                  const workspace = bank.workspaces?.[0];
                                  const isSelected =
                                    selectedBank?.id === bank.id ||
                                    selectedBank?.workspaces?.[0]?.id ===
                                      workspace?.id;

                                  return (
                                    <button
                                      key={workspace?.id || bank.id}
                                      onClick={() => handleBankSelect(bank)}
                                      className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left border",
                                        isSelected
                                          ? "bg-primary/10 border-primary/30"
                                          : "border-transparent hover:bg-muted hover:border-border",
                                      )}
                                    >
                                      <div
                                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                                        style={{
                                          backgroundColor:
                                            workspace?.primaryColor ||
                                            "#1a1a1a",
                                        }}
                                      >
                                        {workspace?.name?.charAt(0) || "B"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                          {workspace?.name || bank.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {workspace?.description ||
                                            "Banking services"}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <div className="text-primary text-sm">
                                          ✓
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
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
                    )}
                  >
                    {/* Left - Chat Messages Area - Expands to cover panel when collapsing */}
                    <div
                      className={cn(
                        "flex flex-col flex-1 min-w-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        showPanel && !isCollapsing
                          ? "border-r border-border"
                          : "border-r-0",
                      )}
                    >
                      {/* Messages */}
                      <div
                        ref={
                          showPanel
                            ? customizationMessagesContainerRef
                            : messagesContainerRef
                        }
                        className="px-4 space-y-3 overflow-y-auto flex-1 min-h-0 pb-2"
                      >
                        {/* Bot Icon at top - scrolls with messages */}
                        <div className="flex justify-center shrink-0 py-8">
                          <div className="relative">
                            <div
                              className="rounded-2xl flex items-center justify-center h-16 w-16"
                              style={{ backgroundColor: `${currentColor}15` }}
                            >
                              <Bot
                                className="h-8 w-8"
                                style={{ color: currentColor }}
                              />
                            </div>
                            <div
                              className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-card"
                              style={{ backgroundColor: "#22d3ee" }}
                            />
                          </div>
                        </div>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2 max-w-[85%]",
                              message.sender === "user"
                                ? "ml-auto flex-row-reverse"
                                : "",
                            )}
                          >
                            {message.sender === "bot" && (
                              <>
                                <div className="flex-shrink-0">
                                  <div
                                    className="rounded-full flex items-center justify-center h-8 w-8"
                                    style={{
                                      backgroundColor: `${currentColor}15`,
                                    }}
                                  >
                                    <Bot
                                      className="h-4 w-4"
                                      style={{ color: currentColor }}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-xs text-muted-foreground px-1">
                                    {currentBotName}
                                  </p>
                                  <div className="rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground">
                                    {message.content}
                                  </div>
                                </div>
                              </>
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
                        {/* Show thinking message while loading */}
                        {isLoadingMessage && (
                          <div className="flex gap-2 max-w-[85%]">
                            <div className="flex-shrink-0">
                              <div
                                className="rounded-full flex items-center justify-center h-8 w-8"
                                style={{ backgroundColor: `${currentColor}15` }}
                              >
                                <Bot
                                  className="h-4 w-4"
                                  style={{ color: currentColor }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground px-1">
                                {currentBotName}
                              </p>
                              <div className="rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground">
                                {currentBotName} is thinking...
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Questions */}
                      <div className="px-4 py-4 shrink-0 border-t bg-background/50 backdrop-blur-sm">
                        <p className="text-xs text-muted-foreground mb-2">
                          Quick Questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {currentQuestions
                            .slice(0, showPanel ? 4 : 2)
                            .map((question: string, index: number) => (
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
                            setInputValue("");
                          }}
                          className="flex gap-2 border rounded-lg px-3 py-2"
                        >
                          <input
                            ref={!showPanel ? defaultInputRef : undefined}
                            value={inputValue}
                            onChange={
                              showPanel
                                ? handleCustomizationInputChange
                                : handleDefaultInputChange
                            }
                            onBlur={
                              !showPanel ? handleDefaultInputBlur : undefined
                            }
                            onFocus={
                              !showPanel ? handleDefaultInputFocus : undefined
                            }
                            placeholder="Type your question..."
                            disabled={isLoadingMessage}
                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:opacity-50"
                            autoComplete="off"
                          />
                          <button
                            type="submit"
                            disabled={isLoadingMessage}
                            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </form>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                          This information is for informational and educational
                          purposes only.
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
                          availableDocuments={docs?.data || []}
                          enabledDocuments={enabledDocuments}
                          onToggleDocument={handleToggleDocument}
                          selectedBotIcon={draftBotIcon}
                          onBotIconChange={setDraftBotIcon}
                          uploadedPdfs={uploadedPdfs}
                          onRemovePdf={handleRemovePdf}
                          enabledPdfs={enabledPdfs}
                          onTogglePdf={handleTogglePdf}
                          workspaceSlug={workspaceSlug}
                          bankCode={data?.data?.[0]?.workspaces?.[0]?.bankCode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
