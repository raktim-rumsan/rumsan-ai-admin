"use client";

import type React from "react";

import { useState } from "react";
import { MainHeader } from "../header/header";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const handleChatButtonClick = () => setChatOpen(true);
  //   const handleChatClose = () => setChatOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <MainHeader
          onMenuClick={() => setSidebarOpen(true)}
          onChatButtonClick={handleChatButtonClick}
          isChatOpen={chatOpen}
        />
        <main className="h-full overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
