"use client";

import { useTenant } from "@/providers/TenantProvider";
import { getAuthToken } from "@/lib/utils";
import { useEffect, useState } from "react";

export function TenantDebugInfo() {
  const { tenantId, isLoading, error, refetch } = useTenant();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [localStorageTenantId, setLocalStorageTenantId] = useState<string | null>(null);

  useEffect(() => {
    // Check auth token and localStorage on mount and every few seconds
    const checkAuth = () => {
      const token = getAuthToken();
      setAuthToken(token);

      if (typeof window !== "undefined") {
        const storedTenantId = localStorage.getItem("tenantId");
        setLocalStorageTenantId(storedTenantId);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border p-4 rounded shadow-lg max-w-md">
      <h3 className="font-bold mb-2">Tenant Debug Info</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Token:</strong> {authToken ? "✅ Present" : "❌ Missing"}
        </div>

        <div>
          <strong>Tenant ID (Context):</strong> {tenantId || "❌ Not set"}
        </div>

        <div>
          <strong>Tenant ID (LocalStorage):</strong> {localStorageTenantId || "❌ Not set"}
        </div>

        <div>
          <strong>Query Loading:</strong> {isLoading ? "⏳ Yes" : "✅ No"}
        </div>

        <div>
          <strong>Query Error:</strong> {error ? `❌ ${error.message}` : "✅ None"}
        </div>

        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Refetch Tenant
        </button>

        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("tenantId");
              setLocalStorageTenantId(null);
            }
          }}
          className="mt-2 ml-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
}
