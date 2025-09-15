// app/widget/chat/page.tsx
"use client";

import { useState } from "react";
import ChatForm, { Message } from "@/components/sections/widget/chat/ChatForm";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      query: "Hello!",
      response: "Hi there! How can I help you today?",
      isLoading: false,
    },
  ]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        query: input,
        response: "This is a mock response.",
        isLoading: false,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <div className="font-semibold text-emerald-700">You:</div>
            <div className="mb-1">{msg.query}</div>
            <div className="font-semibold text-gray-700">Bot:</div>
            <div>{msg.response}</div>
          </div>
        ))}
      </div>
      <ChatForm
        input={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </div>
  );
}