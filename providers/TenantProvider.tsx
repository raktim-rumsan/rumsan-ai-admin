"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTenantQuery } from "@/queries/tenantQuery";
import { getAuthToken } from "@/lib/utils";

interface TenantContextType {
  tenantId: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Initialize tenantId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTenantId = localStorage.getItem("tenantId");
      console.log("TenantProvider: Loading tenantId from localStorage:", storedTenantId);
      if (storedTenantId) {
        setTenantId(storedTenantId);
      }
      setHasLoadedFromStorage(true);
    }
  }, []);

  const { data, isLoading, error, refetch } = useTenantQuery();

  // Log query state for debugging
  useEffect(() => {
    console.log("TenantProvider: Query state", {
      hasData: !!data,
      isLoading,
      hasError: !!error,
      authToken: !!getAuthToken(),
    });
  }, [data, isLoading, error]);

  // Update tenantId when data is fetched
  useEffect(() => {
    if (data?.data?.personal?.slug) {
      const slug = data.data.personal.slug;
      console.log("TenantProvider: Setting tenantId from API:", slug);
      setTenantId(slug);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tenantId", slug);
        console.log("TenantProvider: Stored tenantId in localStorage:", slug);
      }
    }
  }, [data]);

  // Force refetch if we don't have tenantId but have auth token
  useEffect(() => {
    if (hasLoadedFromStorage && !tenantId && !isLoading && typeof window !== "undefined") {
      const authToken = getAuthToken();
      console.log("TenantProvider: Checking if should refetch", {
        hasLoadedFromStorage,
        tenantId,
        isLoading,
        hasAuthToken: !!authToken,
      });

      if (authToken) {
        console.log("TenantProvider: No tenantId found but auth token exists, refetching...");
        refetch();
      }
    }
  }, [hasLoadedFromStorage, tenantId, isLoading, refetch]);

  // Additional effect to try refetching when auth token becomes available
  useEffect(() => {
    const interval = setInterval(() => {
      if (!tenantId && !isLoading && typeof window !== "undefined") {
        const authToken = getAuthToken();
        if (authToken) {
          console.log("TenantProvider: Periodic check - auth token found, refetching...");
          refetch();
        }
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [tenantId, isLoading, refetch]);

  const clearTenant = () => {
    console.log("Clearing tenantId");
    setTenantId(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tenantId");
    }
  };

  const contextValue: TenantContextType = {
    tenantId,
    isLoading,
    error: error as Error | null,
    refetch,
    clearTenant,
  };

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>;
}

// Hook to use the tenant context
export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

// Hook to get just the tenantId (for convenience)
export function useTenantId() {
  const { tenantId } = useTenant();
  return tenantId;
}

// Hook to ensure tenant is loaded
export function useEnsureTenant() {
  const { tenantId, isLoading, refetch } = useTenant();

  useEffect(() => {
    // If we don't have a tenantId and we're not currently loading, try to fetch it
    if (!tenantId && !isLoading && typeof window !== "undefined") {
      const authToken = getAuthToken();
      if (authToken) {
        console.log("useEnsureTenant: Triggering refetch because tenantId is missing");
        refetch();
      }
    }
  }, [tenantId, isLoading, refetch]);

  return { tenantId, isLoading };
}
