import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bot, Maximize2, Minimize2, RotateCcw, Send, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChatMessage, useChatMutation } from "@/queries/chatQuery";

function PreviewChat({
  isFloating,
  isMinimized,
  setIsMinimized,
}: {
  isFloating?: boolean;
  isMinimized?: boolean;
  setIsMinimized?: (minimized: boolean) => void;
}) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatMutation();
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isThinking]);
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
        content:
          "Sorry, I encountered an error while processing your message. Please try again.",
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
    <div className="flex flex-col bg-muted/30 rounded-lg border border-border h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
        <div className="text-sm font-medium text-foreground">Preview Chat</div>

        <div className="flex items-center ">
          {/* Refresh Icon with Tooltip */}
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

          {/* Minimize Icon (NO Tooltip) */}
          {isFloating && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsMinimized?.(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      {!isMinimized && (
        <>
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
                          <div className="text-xs text-muted-foreground mb-1">
                            Sources:
                          </div>
                          <div className="space-y-1">
                            {message.sources[0].payload.fileName ||
                              "Source not defined"}
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
        </>
      )}
    </div>
  );
}

export default PreviewChat;
