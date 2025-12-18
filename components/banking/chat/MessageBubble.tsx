import Markdown from "react-markdown";
import { ChatMessage } from "@/queries/chatQuery";
import { processMessageContent } from "./utils/url-processor";
import { getMarkdownComponents } from "./utils/markdown-components";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // User messages: plain text without link processing
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-lg px-4 py-2.5 text-sm bg-primary text-primary-foreground whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant messages: Markdown with clickable links
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-2.5 text-sm bg-accent text-foreground">
        <Markdown components={getMarkdownComponents()}>
          {processMessageContent(message.content)}
        </Markdown>
      </div>
    </div>
  );
}
