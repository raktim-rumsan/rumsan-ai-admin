import { ChatMessage } from "@/queries/chatQuery";
import { MessageBubble } from "./MessageBubble";
import { RobotIcon } from "../chat-icon";
import { LoadingIndicator } from "./LoadingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="mt-3">
      <div className="flex flex-col items-center gap-2">
        <RobotIcon className="w-20 h-20 animate-bounce" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-muted rounded-full blur-sm" />
      </div>
      <div className="flex flex-col gap-3 mt-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      {isLoading && <LoadingIndicator />}
    </div>
  );
}

