"use client";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopy } from "@/lib/hooks/use-copy";
import { useApiKeys } from "@/queries/apiKeysQuery";
import { WidgetConfig } from "./widget-customization";

interface CodeSnippetProps {
  config: WidgetConfig;
}

export function CodeSnippet({ config }: CodeSnippetProps) {
  const [selectedTab, setSelectedTab] = useState("react");
  const [isMounted, setIsMounted] = useState(false);
  const { isCopied, setIsCopied, copyContent } = useCopy();

  // Only fetch API keys after component is mounted to prevent hydration issues
  const { data: apiKeys = [], isLoading } = useApiKeys();

  // Ensure component only renders fully after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const tenantId = isMounted ? localStorage.getItem("tenantId") : null;
  const BASE_URL = process.env.NEXT_PUBLIC_URL!;

  // Get the first available API key
  const currentApiKey = apiKeys.length > 0 ? apiKeys[0].apiKey : null;

  const snippetCode = useMemo(() => {
    if (!currentApiKey) return null;

    const params = new URLSearchParams({
      user: tenantId || "",
      apiKey: currentApiKey,
      title: config.title,
      color: config.color,
    });

    if (config.logoUrl) {
      params.append("logoUrl", config.logoUrl);
    }

    if (config.bottomPosition) {
      params.append("bottomPosition", config.bottomPosition.toString());
    }

    const iFrameSrc = `${BASE_URL}/widget/chat?${params.toString()}`;
    return {
      react: `<iframe 
  src="${iFrameSrc}"
  title="${config.title}"
  style={{
    position: "fixed",
    bottom: "${config.bottomPosition}px",
    right: "20px",
    width: "${config.width}px",
    height: "${config.height}px",
    border: "none",
    background: "transparent",
    zIndex: 1000,
    pointerEvents: "auto"
  }}
  allow="camera; microphone"
/>`,
      html: `<iframe 
  src="${iFrameSrc}" 
  title="${config.title}"
  style="
    position: fixed;
    bottom: ${config.bottomPosition}px;
    right: 20px;
    width: ${config.width}px;
    height: ${config.height}px;
    border: none;
    background: transparent;
    z-index: 1000;
    pointer-events: auto;
  "
  allow="camera; microphone">
</iframe>`,
    };
  }, [tenantId, currentApiKey, BASE_URL, config]);

  const handleCopy = () => {
    if (
      snippetCode &&
      typeof snippetCode === "object" &&
      snippetCode !== null &&
      "react" in snippetCode &&
      "html" in snippetCode
    ) {
      const cleanCode = snippetCode[selectedTab as "react" | "html"].replace(/\s+/g, " ").trim();
      copyContent(cleanCode);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, setIsCopied]);

  const renderContent = () => {
    if (!isMounted || isLoading) return "Loading...";

    if (!currentApiKey) {
      return "You have not created an API key yet";
    }

    if (!snippetCode) return "Unable to generate code snippet";

    if (selectedTab === "react") {
      return snippetCode.react;
    }
    return snippetCode.html;
  };

  // Show loading state until component is mounted and hydrated
  if (!isMounted) {
    return (
      <div className="relative mt-4">
        <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-4">
      {!currentApiKey && !isLoading ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8 bg-muted rounded-lg text-center">
          <span className="text-muted-foreground">You have not created an API key yet</span>
          <Button
            onClick={() => (window.location.href = "/dashboard/settings")}
            variant="outline"
            size="sm"
          >
            Create API Key
          </Button>
        </div>
      ) : (
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className="flex flex-col gap-2 w-full"
          defaultValue="react"
        >
          <div className="flex flex-col sm:flex-row gap-2 justify-start items-start sm:items-center">
            <p className="text-sm whitespace-nowrap">Embed using</p>
            <TabsList>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
          </div>

          <div className="relative w-full">
            <pre className="rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap break-all overflow-x-auto max-w-full min-h-[100px]">
              <TabsContent value="react" className="whitespace-pre-wrap break-all">
                {renderContent()}
              </TabsContent>
              <TabsContent value="html" className="whitespace-pre-wrap break-all">
                {renderContent()}
              </TabsContent>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-3 top-2 border-2 cursor-pointer"
              onClick={handleCopy}
              disabled={isLoading || !tenantId || !currentApiKey}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
}
