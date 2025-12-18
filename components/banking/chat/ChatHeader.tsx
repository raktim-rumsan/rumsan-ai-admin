import { Bot } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="mb-2 p-4 flex items-center gap-2 border-b border-border">
      <div className="flex h-8 w-8 items-center justify-center rounded-full">
        <Bot className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-card-foreground">
          Rumsan Banking Assistant
        </h3>
        <p className="text-xs text-muted-foreground">
          Ask about our banking services here
        </p>
      </div>
    </div>
  );
}

