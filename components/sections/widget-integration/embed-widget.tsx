"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstructionsText } from "./instructions-text";
import { CodeSnippet } from "./code-snippet";
import { WidgetCustomization, WidgetConfig } from "./widget-customization";

export function EmbedWidget() {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    width: 400,
    height: 500,
    color: "#10b981",
    title: "Rumsan AI Chat",
    logoUrl: "",
  });

  return (
    <div className="p-4 w-full max-w-full space-y-6 overflow-hidden">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="rounded-md bg-muted p-2 flex-shrink-0">
            <code className="text-primary">&lt;/&gt;</code>
          </div>
          <CardTitle className="truncate">Add Widget to Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InstructionsText />
        </CardContent>
      </Card>

      <WidgetCustomization onConfigChange={setWidgetConfig} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500 flex-shrink-0" />
            <span className="truncate">Generated Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <CodeSnippet config={widgetConfig} />
        </CardContent>
      </Card>
    </div>
  );
}
