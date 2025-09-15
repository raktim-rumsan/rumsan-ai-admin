"use client";
import * as React from "react";
import ChatPage from "../../chats/chat";

export default function ChatWidgetInterface({
  chatId,
}: Readonly<{ chatId: string }>) {
  return (
    <div className="h-full">
      <ChatPage />
    </div>
  );
}
