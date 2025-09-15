"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstructionsText } from "./instructions-text";
import { CodeSnippet } from "./code-snippet";

export function EmbedWidget() {
  return (
    <div className="p-4 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="rounded-md bg-muted p-2 ">
            <code className="text-primary">&lt;/&gt;</code>
          </div>
          <CardTitle>Add Widget to Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InstructionsText />
          <CodeSnippet />
        </CardContent>
      </Card>
    </div>
  );
}
