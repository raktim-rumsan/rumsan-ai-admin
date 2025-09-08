"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/providers/TenantProvider";
import { getAuthToken } from "@/lib/utils";

export function TenantDebugPanel() {
  const { tenantId, isLoading, error, refetch } = useTenant();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [localStorageTenantId, setLocalStorageTenantId] = useState<string | null>(null);

  useEffect(() => {
    const checkValues = () => {
      const token = getAuthToken();
      setAuthToken(token);

      if (typeof window !== "undefined") {
        const storedTenantId = localStorage.getItem("tenantId");
        setLocalStorageTenantId(storedTenantId);
      }
    };

    checkValues();
    const interval = setInterval(checkValues, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-blue-500 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-blue-600 mb-3">🔍 Tenant Debug Panel</h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="font-medium">Auth Token:</span>
          <span className={authToken ? "text-green-600" : "text-red-600"}>
            {authToken ? "✅ Present" : "❌ Missing"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Context TenantId:</span>
          <span className={tenantId ? "text-green-600" : "text-gray-500"}>
            {tenantId || "❌ Not set"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">LocalStorage:</span>
          <span className={localStorageTenantId ? "text-green-600" : "text-gray-500"}>
            {localStorageTenantId || "❌ Not set"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Query Loading:</span>
          <span className={isLoading ? "text-yellow-600" : "text-green-600"}>
            {isLoading ? "⏳ Loading" : "✅ Done"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Query Error:</span>
          <span className={error ? "text-red-600" : "text-green-600"}>
            {error ? "❌ Error" : "✅ None"}
          </span>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div className="mt-3 space-y-1">
          <button
            onClick={() => refetch()}
            className="w-full px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            🔄 Refetch Tenant
          </button>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("tenantId");
                setLocalStorageTenantId(null);
              }
            }}
            className="w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            🗑️ Clear LocalStorage
          </button>

          <button
            onClick={() => {
              console.log("=== TENANT DEBUG INFO ===");
              console.log("Auth Token:", getAuthToken());
              console.log("Tenant ID (context):", tenantId);
              console.log("Tenant ID (localStorage):", localStorage.getItem("tenantId"));
              console.log("Is Loading:", isLoading);
              console.log("Error:", error);
              console.log("========================");
            }}
            className="w-full px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
          >
            📝 Log Debug Info
          </button>
        </div>
      </div>
    </div>
  );
}
