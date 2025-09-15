import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export interface Message {
  id: string;
  query: string;
  response: string;
  isLoading: boolean;
  response_id?: string;
}
export interface ChatFormProps {
  readonly input: string;
  readonly onSubmit: () => void;
  readonly onChange: (value: string) => void;
  readonly isLoading?: boolean;
}
const ChatForm = ({
  input,
  onSubmit,
  onChange,
  isLoading = false,
}: Readonly<ChatFormProps>) => {
  return (
    <form className="flex w-full items-center space-x-2">
      <Input
        id="message"
        name="message"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
        autoComplete="off"
      />
      <Button
        size="icon"
        className="bg-emerald-400 text-white"
        disabled={!input.trim() || isLoading}
        onClick={onSubmit}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};

export default ChatForm;
