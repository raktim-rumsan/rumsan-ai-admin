"use client";

import ChatbotPreview from "@/components/chatbot-preview/chatbot-preview";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MainHeader } from "@/components/header/header";
import { ProtectedStoreInitializer } from "@/components/layout/ProtectedStoreInitializer";
import type React from "react";

import { useState } from "react";

interface SectionsLayoutProps {
  children: React.ReactNode;
}

export default function SectionsLayout({ children }: SectionsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const handleChatButtonClick = () => setChatOpen(true);
  const handleChatClose = () => setChatOpen(false);

  return (
    <ProtectedStoreInitializer>
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
    </ProtectedStoreInitializer>
  );
}
