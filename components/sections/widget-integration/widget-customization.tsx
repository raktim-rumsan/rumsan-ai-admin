"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetCustomizationProps {
  onConfigChange: (config: WidgetConfig) => void;
}

export interface WidgetConfig {
  width: number;
  height: number;
  color: string;
  title: string;
  logoUrl?: string;
}

export function WidgetCustomization({ onConfigChange }: WidgetCustomizationProps) {
  const [config, setConfig] = useState<WidgetConfig>({
    width: 400,
    height: 500,
    color: "#10b981", // emerald-500
    title: "Rumsan AI Chat",
    logoUrl: "",
  });

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <Card className="mb-6 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 flex-shrink-0" />
          <span className="truncate">Widget Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-hidden">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Chat Widget Title</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            placeholder="Enter widget title"
            className="w-full"
          />
        </div>

        {/* Logo URL Input */}
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
          <Input
            id="logoUrl"
            value={config.logoUrl || ""}
            onChange={(e) => updateConfig({ logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            type="url"
            className="w-full"
          />
          <p className="text-xs text-gray-500 break-words">
            Leave empty to use the default chat icon. Recommended size: 24x24px or 32x32px
          </p>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Width: {config.width}px</Label>
            <Slider
              value={[config.width]}
              onValueChange={(value) => updateConfig({ width: value[0] })}
              min={300}
              max={600}
              step={10}
              className="w-full"
            />
          </div>
          <div className="space-y-3">
            <Label>Height: {config.height}px</Label>
            <Slider
              value={[config.height]}
              onValueChange={(value) => updateConfig({ height: value[0] })}
              min={400}
              max={700}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-3">
          <Label htmlFor="color">Primary Color</Label>
          <div className="flex items-center gap-3">
            <Input
              id="color"
              type="color"
              value={config.color}
              onChange={(e) => updateConfig({ color: e.target.value })}
              className="w-20 h-10 p-1 border rounded flex-shrink-0"
            />
            <Input
              value={config.color}
              onChange={(e) => updateConfig({ color: e.target.value })}
              placeholder="#10b981"
              className="flex-1 min-w-0"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="relative border rounded-lg p-4 bg-gray-50 h-32 overflow-hidden">
            {/* Mock chat bubble */}
            <div className="absolute bottom-4 right-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                style={{
                  backgroundColor: config.color,
                }}
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
                <svg
                  className={`w-5 h-5 ${config.logoUrl ? "hidden" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
            </div>

            {/* Mock chat window */}
            <div
              className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg border overflow-hidden"
              style={{
                width: Math.min(config.width * 0.6, 200),
                height: Math.min(config.height * 0.4, 120),
              }}
            >
              <div
                className="text-white text-xs p-2 flex items-center gap-1"
                style={{ backgroundColor: config.color }}
              >
                {config.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="w-3 h-3 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <svg
                  className={`w-3 h-3 ${config.logoUrl ? "hidden" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="font-medium truncate">{config.title}</span>
              </div>
              <div className="p-2 text-xs text-gray-500">Chat interface preview...</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
