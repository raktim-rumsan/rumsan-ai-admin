import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  textareaRef: React.Ref<HTMLTextAreaElement>;
}

export function ChatInput({
  input,
  onInputChange,
  onSend,
  isLoading,
  textareaRef,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
        <Textarea
          ref={textareaRef}
          placeholder="Type your question..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-transparent text-sm outline-none resize-none"
        />
        <Button
          size="icon"
          variant="ghost"
          disabled={isLoading}
          className="h-8 w-8 shrink-0"
          onClick={onSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

