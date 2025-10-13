"use client";
import IntegrationsContent from "./integration-content";
import { integrationItem } from "./integration-constant";

export default function IntegrationLists() {
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
