"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  MessageList,
  ChatHeader,
  QuickQuestions,
  ChatInput,
  useChat,
} from "./chat";

import { QUICK_QUESTIONS } from "@/constants/chatbot-questions";

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollAreaRef,
    textareaRef,
    handleSendMessage,
    handleQuickQuestion,
  } = useChat();

  return (
    <Card
      className={`w-full max-w-md border border-border bg-card shadow-lg ${
        className || ""
      }`}
    >
      <ChatHeader />

      <ScrollArea
        ref={scrollAreaRef}
        className="h-80 w-full pr-4 pb-4 pt-0 pl-4"
      >
        <MessageList messages={messages} isLoading={isLoading} />
      </ScrollArea>

      <QuickQuestions
        questions={QUICK_QUESTIONS}
        onQuestionClick={handleQuickQuestion}
        isLoading={isLoading}
      />

      <ChatInput
        input={input}
        onInputChange={setInput}
        onSend={handleSendMessage}
        isLoading={isLoading}
        textareaRef={textareaRef}
      />

      <p className="px-4 py-3 pb-4 text-center text-xs text-muted-foreground">
        This information is for informational and educational purposes only.
      </p>
    </Card>
  );
}
