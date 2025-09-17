"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "Rumsan AI",
    color: "#10b981",
    logoUrl: "",
    bottomPosition: 20,
  });

  useEffect(() => {
    // Get configuration from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title") || "Rumsan AI";
    const color = urlParams.get("color") || "#10b981";
    const logoUrl = urlParams.get("logoUrl") || "";
    const bottomPosition = parseInt(urlParams.get("bottomPosition") || "20", 10);

    setConfig({ title, color, logoUrl, bottomPosition });
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Bubble - Minimal for iframe integration */}
      {!isOpen && (
        <div className="fixed right-4 z-50" style={{ bottom: `${config.bottomPosition}px` }}>
          <Button
            onClick={toggleChat}
            className="h-12 w-12 rounded-full transition-colors duration-200 flex items-center justify-center"
            style={{
              backgroundColor: config.color,
              color: "white",
            }}
            size="icon"
          >
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt="Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to chat icon if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <MessageCircle className={`h-5 w-5 ${config.logoUrl ? "hidden" : ""}`} />
          </Button>
        </div>
      )}

      {/* Chat Interface Overlay - Minimal styling */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop - Transparent for iframe */}
          <div className="absolute inset-0" onClick={toggleChat} />

          {/* Chat Container - Positioned at bottom right */}
          <div
            className="absolute right-4 bg-white w-80 h-96 flex flex-col overflow-hidden"
            style={{ bottom: `${config.bottomPosition}px` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-3 text-white"
              style={{ backgroundColor: config.color }}
            >
              <div className="flex items-center gap-2">
                {config.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <MessageCircle className={`h-4 w-4 ${config.logoUrl ? "hidden" : ""}`} />
                <span className="font-semibold text-sm">{config.title}</span>
              </div>
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-black/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface className="h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
