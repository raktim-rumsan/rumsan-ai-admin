"use client";

import { useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";
import { useOrganizationStore } from "@/stores/organizationStore";
import { ROUTES } from "@/constants";
import type { OrganizationContextResponse } from "@/queries/organizationQuery";
import { usePathname } from "next/navigation";

const CACHE_DURATION = 5 * 60 * 1000;

// Routes where organization context should NOT be fetched
const EXCLUDED_ROUTES = [
  "/",
  "/auth/login",
  "/auth/sign-up",
  "/auth/verify-otp",
  "/auth/sign-up-success",
  "/widget",
  "/bank",
];

// Utility function to sync organization context to cookies
function syncOrganizationContextToCookie(
  context: OrganizationContextResponse["data"] | Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  try {
    const contextData = {
      userState: "userState" in context ? context.userState : null,
      primaryOrganization:
        "primaryOrganization" in context ? context.primaryOrganization : null,
      organizations: "organizations" in context ? context.organizations : null,
    };

    const contextString = JSON.stringify(contextData);
    // Set cookie with 1 day expiration
    document.cookie = `organizationContext=${encodeURIComponent(
      contextString
    )}; path=/; max-age=86400; SameSite=Lax`;
  } catch (error) {
    console.error("Error syncing organization context to cookie:", error);
  }
}

// Utility function to clear organization context cookie
function clearOrganizationContextCookie() {
  if (typeof window === "undefined") return;
  document.cookie = "organizationContext=; path=/; max-age=0";
}

export function useOrganizationContext() {
  const organizationStore = useOrganizationStore();
  const accessToken = getAuthToken();
  const pathname = usePathname();

  const storeRef = useRef(organizationStore);
  storeRef.current = organizationStore;

  const isCacheStale = useCallback(() => {
    if (!organizationStore.lastFetched) return true;
    return Date.now() - organizationStore.lastFetched > CACHE_DURATION;
  }, [organizationStore.lastFetched]);

  // Check if current route is excluded
  // Use exact match for "/" to avoid matching all routes
  const isExcludedRoute = EXCLUDED_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(route);
  });

  const shouldFetch = Boolean(
    accessToken &&
      !isExcludedRoute &&
      (!organizationStore.isLoaded || isCacheStale())
  );
  const { data, error, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ["organizationContext", accessToken],
    queryFn: async (): Promise<OrganizationContextResponse> => {
      const response = await fetch(ROUTES.ORGANIZATION_CONTEXT, {
        method: "GET",
        headers: {
          access_token: accessToken!,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    },
    enabled: shouldFetch,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes("401") || error?.message?.includes("403"))
        return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2, // Keep in cache for twice as long
  });

  useEffect(() => {
    if (isSuccess && data) {
      storeRef.current.setContext(data.data);
      // Sync to cookie for middleware access
      syncOrganizationContextToCookie(data.data);
    }
  }, [isSuccess, data]);

  // Update store loading state
  useEffect(() => {
    storeRef.current.setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch organization context";
      storeRef.current.setError(errorMessage);
      console.error("Organization context fetch error:", error);
    } else {
      storeRef.current.setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!storeRef.current.isLoaded && !isLoading && !accessToken) {
      const savedContext = localStorage.getItem("organizationContext");
      if (savedContext) {
        try {
          const parsedContext = JSON.parse(savedContext);
          const isStale =
            !parsedContext.lastFetched ||
            Date.now() - parsedContext.lastFetched > CACHE_DURATION;
          if (!isStale) {
            storeRef.current.hydrate(parsedContext);
            // Sync to cookie for middleware access
            syncOrganizationContextToCookie(parsedContext);
          } else {
            localStorage.removeItem("organizationContext");
            clearOrganizationContextCookie();
          }
        } catch (error) {
          console.error("Failed to parse saved organization context:", error);
          localStorage.removeItem("organizationContext");
          clearOrganizationContextCookie();
        }
      }
    }
  }, [isLoading, accessToken]);

  const refetchContext = useCallback(async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    storeRef.current.setLoading(true);
    storeRef.current.setError(null);

    try {
      const result = await refetch();
      return result.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to refetch organization context";
      storeRef.current.setError(errorMessage);
      throw error;
    }
  }, [accessToken, refetch]);

  const forceRefresh = useCallback(async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }
    storeRef.current.clearContext();
    localStorage.removeItem("organizationContext");
    clearOrganizationContextCookie();
    return refetchContext();
  }, [accessToken, refetchContext]);

  return {
    // Data state
    organizations: organizationStore.organizations,
    workspaces: organizationStore.workspaces,
    primaryOrganization: organizationStore.primaryOrganization,
    pendingInvitations: organizationStore.pendingInvitations,
    userState: organizationStore.userState,
    redirectTo: organizationStore.redirectTo,

    // Loading states
    isLoaded: organizationStore.isLoaded,
    isLoading: organizationStore.isLoading || isLoading,
    error: organizationStore.error,

    // Actions
    refetch: refetchContext,
    forceRefresh,
    clearContext: storeRef.current.clearContext,

    // Utility
    isCacheStale: isCacheStale(),
    lastFetched: organizationStore.lastFetched,
  };
}

export function useRequiredOrganizationContext() {
  const context = useOrganizationContext();

  useEffect(() => {
    if (!context.isLoading && !context.isLoaded && context.error) {
      console.error(
        "Required organization context is not available:",
        context.error
      );
    }
  }, [context.isLoading, context.isLoaded, context.error]);

  return context;
}
