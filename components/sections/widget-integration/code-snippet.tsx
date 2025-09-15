"use client";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopy } from "@/lib/hooks/use-copy";

export function CodeSnippet() {
  const [selectedTab, setSelectedTab] = useState("react");
  const { isCopied, setIsCopied, copyContent } = useCopy();

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };
  const tenantId = localStorage.getItem("tenantId");
  const api_key="sk_test_1234567890";
  const BASE_URL = "http://localhost:3000";

  const snippetCode = useMemo(() => {
    const iFrameSrc = `${BASE_URL}/widget/chat?userId=${tenantId}&apiKey=${api_key}`;
    return {
      react: `<iframe src="${iFrameSrc}"
      title="ChatWidget" height="700" width="370" scrolling="no"
      style={{
        borderRadius: "20px",
        boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
        border: "none",
      }}/>`,
      html: `<iframe src="${iFrameSrc}" 
     title="ChatWidget" 
     height="700" 
     width="370" 
     scrolling="no" 
     style="border-radius: 20px; 
         box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); 
         border: none;">
     </iframe>`,
    };
  }, [tenantId, api_key]);

  const handleCopy = () => {
    if (
      typeof snippetCode === "object" &&
      snippetCode !== null &&
      "react" in snippetCode &&
      "html" in snippetCode
    ) {
      const cleanCode = snippetCode[selectedTab as "react" | "html"]
        .replace(/\s+/g, " ")
        .trim();
      copyContent(cleanCode);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const renderContent = () => {
    // if (isPending) return "Loading...";
    if (selectedTab === "react") {
      return snippetCode.react;
    }
    return snippetCode.html;
  };
  return (
    <div className="relative mt-4">
      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="flex flex-col gap-2"
        defaultValue="react"
      >
        <div className="flex gap-2 justify-start items-center">
          <p className="text-sm">Embed using </p>
          <TabsList>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </div>

        <div className="relative">
          <pre className="rounded-lg bg-muted p-4 text-sm whitespace-normal">
            <TabsContent value="react">{renderContent()}</TabsContent>
            <TabsContent value="html">{renderContent()}</TabsContent>
          </pre>
          <Button
            size="sm"
            variant="secondary"
            className="absolute right-3 top-2 border-2 cursor-pointer"
            onClick={handleCopy}
            // disabled={isPending || !tenantId || !api_key}
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
    </div>
  );
}
