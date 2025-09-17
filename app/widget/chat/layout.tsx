"use client";

import { ChatBubble } from "@/components/chat/ChatBubble";

export default function ChatWidgetLayout() {
  return (
    <div className="w-full h-full relative">
      {/* Only show the floating chat bubble - transparent background for iframe */}
      <ChatBubble />
    </div>
  );
}
