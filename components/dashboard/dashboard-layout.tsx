"use client";

import type React from "react";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MainHeader } from "../header/header";
import ChatbotPreview from "../chatbot-preview/chatbot-preview";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const handleChatButtonClick = () => setChatOpen(true);
  const handleChatClose = () => setChatOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <MainHeader
          onMenuClick={() => setSidebarOpen(true)}
          onChatButtonClick={handleChatButtonClick}
          isChatOpen={chatOpen}
        />
        <ChatbotPreview
          chatOpen={chatOpen}
          onChatOpen={handleChatButtonClick}
          onChatClose={handleChatClose}
        >
          <main className="h-full overflow-auto p-6">{children}</main>
        </ChatbotPreview>
      </div>
    </div>
  );
}
