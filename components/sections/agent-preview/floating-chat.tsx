"use client";

import { usePathname } from "next/navigation";
import PreviewChat from "./preview-chat";
import { useState } from "react";

export default function FloatingPreviewChat() {
  const [isMinimized, setIsMinimized] = useState(false);

  const pathname = usePathname();
  const isAgentPreview = pathname === "/dashboard/agent-preview";

  // Only show floating version if NOT on agent preview page
  if (isAgentPreview) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 w-[400px]  bg-background border border-border rounded-2xl shadow-lg overflow-hidden z-50 ${
        isMinimized ? "h-16 w-[200px]" : "h-[500px]"
      }`}
    >
      <PreviewChat
        isFloating={true}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
      />
    </div>
  );
}
