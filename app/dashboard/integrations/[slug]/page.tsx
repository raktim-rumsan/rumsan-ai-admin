"use client";
import { integrationItem } from "@/components/sections/integrations/integration-constant";
import SlackIntegrationGuide from "@/components/sections/integrations/slack-instruction-guide";
import { EmbedWidget } from "@/components/sections/widget-integration/embed-widget";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import React from "react";

export default function IntegrationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const item = integrationItem.slugsItems.find(
    (item) => item.slug === resolvedParams.slug
  );

  if (!item) return notFound();

  return (
    <div className="p-4 w-full max-w-full space-y-6 overflow-hidden">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/integrations")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Integrations
        </Button>
      </div>

      {item.component}
    </div>
  );
}
