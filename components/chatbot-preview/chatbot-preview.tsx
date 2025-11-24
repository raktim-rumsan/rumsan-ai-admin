"use client";

import { AlignHorizontalDistributeStart, BotMessageSquare } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ResizableChatPanel } from "./chat-resizeable-panel";
import { Button } from "../ui/button";
import { useState } from "react";
import type React from "react";
import PreviewChat from "../sections/agent-preview/preview-chat";

interface ChatbotPreviewProps {
  children?: React.ReactNode;
}

export default function ChatbotPreview({ children }: ChatbotPreviewProps) {
  const [chatOpen, setChatOpen] = useState(true);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Main Content Panel */}
        <ResizablePanel
          defaultSize={chatOpen ? 50 : 100} // 50% when chat open, 100% when closed
          minSize={50}
          className="overflow-auto"
        >
          {children}
        </ResizablePanel>

        {/* Chat Panel with Handle */}
        {chatOpen && (
          <>
            <ResizableHandle
              withHandle
              className="flex items-center justify-center"
            >
              <AlignHorizontalDistributeStart className="h-4 w-4" />
            </ResizableHandle>
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <ResizableChatPanel onClose={() => setChatOpen(false)} />
              {/* <PreviewChat /> */}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Floating button to reopen chat when closed */}
      {!chatOpen && (
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white pointer-events-auto animate-blink-pulse"
          size="icon"
        >
          <BotMessageSquare />
        </Button>
      )}
    </div>
  );
}
