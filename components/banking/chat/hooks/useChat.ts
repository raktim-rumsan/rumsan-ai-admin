import { useState, useEffect, useRef } from "react";
import {
  ChatMessage,
  clearChatHistory,
  useChatIndustryMutation,
} from "@/queries/chatQuery";
import { toastUtils } from "@/lib/toast-utils";

const createWelcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your Rumsan AI Assistant.",
  timestamp: new Date(),
});

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const industryChatMutation = useChatIndustryMutation();

  // Clear chat history on mount
  useEffect(() => {
    clearChatHistory();
    setMessages([createWelcomeMessage()]);
  }, []);

  // Auto-scroll to bottom when messages change
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await industryChatMutation.mutateAsync({
        query: content.trim(),
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

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toastUtils.generic.error(
        "Failed to get response",
        error instanceof Error ? error.message : "Unknown error"
      );

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    sendMessage(question);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    scrollAreaRef,
    textareaRef,
    handleSendMessage,
    handleQuickQuestion,
  };
}
