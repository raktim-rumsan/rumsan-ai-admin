"use client";
import Prerequisites from "@/components/sections/integrations/prerequisite";
import SlackIntegrationGuide from "@/components/sections/integrations/slack-instruction-guide";
import { EmbedWidget } from "@/components/sections/widget-integration/embed-widget";
import { Button } from "@/components/ui/button";
import { integrationItem } from "@/constants/integration-item";
import { notFound, useRouter } from "next/navigation";
import React from "react";

export default function IntegrationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  console.log(resolvedParams, "resolvedParams");
  const item = integrationItem.slugsItems.find(
    (i) => i.slug === resolvedParams.slug
  );
  const router = useRouter();

  if (!item) return notFound();

  return (
    <div className="p-4 w-full max-w-full space-y-6 overflow-hidden">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/integration-services")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Integrations
        </Button>
      </div>

      {/* Example: conditional content per integration */}
      {item.slug === "slack-bot" && <SlackIntegrationGuide />}

      {item.slug === "chat-widget" && <EmbedWidget />}
    </div>
  );
}
