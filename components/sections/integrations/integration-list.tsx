"use client";
import IntegrationsContent from "./integration-content";
import { integrationItem } from "./integration-constant";
import { Layers, Sparkles } from "lucide-react";

export default function IntegrationLists() {
  const widgetIntegrations = integrationItem.slugsItems.filter(
    (item) => item.category === "widget"
  );
  const serviceIntegrations = integrationItem.slugsItems.filter(
    (item) => item.category === "service"
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 overflow-auto p-8">
        <div className="w-full mx-auto space-y-12">
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Widgets</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Enhance your website with intelligent, interactive widgets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgetIntegrations.map((item) => (
                <IntegrationsContent item={item} key={item.slug} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Services</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Connect with popular communication and messaging platforms
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceIntegrations.map((item) => (
                <IntegrationsContent item={item} key={item.slug} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
