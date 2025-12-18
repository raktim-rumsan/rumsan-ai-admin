"use client";
import { integrationItem } from "@/components/sections/integrations/integration-constant";
import { Button } from "@/components/ui/button";
import { notFound, useParams, useRouter } from "next/navigation";

export default function IntegrationDetail() {
  const router = useRouter();
  const { slug, workspaceId } = useParams();
  const item = integrationItem.slugsItems.find((item) => item.slug === slug);
  if (!item) return notFound();
  return (
    <div className="p-4 w-full max-w-full space-y-6 overflow-hidden">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() =>
            router.push(`/dashboard/workspace/${workspaceId}/integrations`)
          }
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Integrations
        </Button>
      </div>

      {item.component}
    </div>
  );
}
