"use client";

import { Button } from "@/components/ui/button";
import { integrationItem } from "@/constants/integration-item";
import { Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import IntegrationsContent from "./integration-content";

export default function IntegrationLists() {
  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(
    null
  );


  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {integrationItem.slugsItems.map((item) => (
            <IntegrationsContent item={item} key={item.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
