"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import API_BASE_URL from "@/constants";

interface WidgetInterfaceProps {
  className?: string;
}

interface WidgetMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface WidgetConfig {
  apiKey: string;
  tenantId: string;
}

// Simple widget API call function
async function sendWidgetChatQuery(
  query: string,
  apiKey: string,
  tenantId: string
): Promise<{ answer: string }> {
  // Use a fallback URL if API_BASE_URL is not defined
  const endpoint = `${API_BASE_URL}/rag/query-api`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": tenantId,
        "x-api-key": apiKey,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
      mode: "cors", // Explicitly set CORS mode
      credentials: "omit", // Don't include credentials
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      answer: data.answer || data.data?.answer || "No response received",
    };
  } catch (error) {
    console.error("Fetch error details:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout: The server took too long to respond."
        );
      }
      if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
        throw new Error(
          "Request blocked: Please disable ad blockers or try a different browser."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Network error: Unable to connect to the API server. Please check if the server is running and accessible."
        );
      }
    }
    throw error;
  }
}

export function WidgetInterface({ className }: WidgetInterfaceProps) {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    apiKey: "",
    tenantId: "",
  });
  const [configError, setConfigError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "failed"
  >("checking");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      const testEndpoint = `${API_BASE_URL}/rag/health`;
      const response = await fetch(testEndpoint, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (response.ok) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("failed");
        console.warn("API connection test failed:", response.status);
      }
    } catch (error) {
      setConnectionStatus("failed");
      console.error("API connection test error:", error);
    }
  };

  // Get widget configuration from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get("apiKey");
    const userId = urlParams.get("user");

    if (!apiKey || !userId) {
      setConfigError("Missing required parameters: apiKey and user");
      return;
    }

    setWidgetConfig({
      apiKey,
      tenantId: userId,
    });

    setConfigError(null);

    // Test API connection after configuration is set
    testApiConnection();
  }, []);

  // Auto-scroll to bottom when new messages are added
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
    if (!input.trim() || isLoading || configError) return;

    const userMessage: WidgetMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendWidgetChatQuery(
        input.trim(),
        widgetConfig.apiKey,
        widgetConfig.tenantId
      );

      const assistantMessage: WidgetMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Widget chat error:", error);

      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Request blocked")) {
          errorMessage =
            "Request blocked by browser. Please disable ad blockers and try again.";
        } else if (error.message.includes("Request timeout")) {
          errorMessage =
            "Request timed out. The server is taking too long to respond.";
        } else if (error.message.includes("Network error")) {
          errorMessage =
            "Unable to connect to the server. Please check your connection.";
        } else if (error.message.includes("API Error: 401")) {
          errorMessage = "Authentication failed. Please check your API key.";
        } else if (error.message.includes("API Error: 403")) {
          errorMessage = "Access denied. Please check your permissions.";
        } else if (error.message.includes("API Error: 404")) {
          errorMessage = "Service not found. Please contact support.";
        } else if (error.message.includes("API Error: 500")) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      const errorMessageObj: WidgetMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages([...newMessages, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderMessage = (message: WidgetMessage) => {
    const isUser = message.role === "user";

    return (
      <div
        key={message.id}
        className={`flex gap-3 p-4 ${isUser ? "bg-gray-50" : "bg-white"}`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>

          <div className="text-sm text-gray-700 break-words whitespace-pre-wrap">
            {message.content}
          </div>

          {!isUser && (
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-gray-500 hover:text-gray-700"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-gray-500 hover:text-gray-700"
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-gray-500 hover:text-gray-700"
              >
                <ThumbsDown className="w-3 h-3" />
              </Button> */}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show configuration error if widget is not properly configured
  if (configError) {
    return (
      <div className={`flex flex-col h-full bg-white ${className}`}>
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
          <Bot className="w-12 h-12 mb-4 text-red-300" />
          <h3 className="text-lg font-medium mb-2 text-red-600">
            Configuration Error
          </h3>
          <p className="text-center text-sm mb-4">{configError}</p>
          <div className="text-xs text-gray-400 text-center space-y-1">
            <p>Required URL parameters:</p>
            <p>• apiKey: {widgetConfig.apiKey ? "✓" : "✗"}</p>
            <p>• user: {widgetConfig.tenantId ? "✓" : "✗"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Connection Status Banner */}
      {connectionStatus === "failed" && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center justify-center text-red-600 text-sm">
            <span className="mr-2">⚠️</span>
            API connection failed. Please check your ad blocker or try a
            different browser.
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-full mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
              <Bot className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-center text-sm">
                Start a conversation by asking questions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map(renderMessage)}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-3 p-4 bg-white">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    AI Assistant
                  </span>
                  <span className="text-xs text-gray-500">thinking...</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="min-h-[48px] max-h-32 resize-none pr-12 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
