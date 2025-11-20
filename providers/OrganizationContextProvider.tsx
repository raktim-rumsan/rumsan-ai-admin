"use client";

import { useEffect } from "react";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { getAuthToken } from "@/lib/utils";

interface OrganizationContextProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that automatically manages organization context
 * - Initializes context on app startup
 * - Handles refetching when user authentication state changes
 * - Provides context to all child components
 */
export function OrganizationContextProvider({
  children,
}: OrganizationContextProviderProps) {
  const organizationContext = useOrganizationContext();
  const accessToken = getAuthToken();

  // Initialize organization context when component mounts
  useEffect(() => {
    if (
      accessToken &&
      !organizationContext.isLoaded &&
      !organizationContext.isLoading
    ) {
    }
  }, [
    accessToken,
    organizationContext.isLoaded,
    organizationContext.isLoading,
  ]);

  // Handle auth token changes (login/logout)
  useEffect(() => {
    if (!accessToken && organizationContext.isLoaded) {
      // User logged out, clear the context
      organizationContext.clearContext();
    }
  }, [accessToken, organizationContext]);

  return <>{children}</>;
}

/**
 * Hook to initialize organization context in components
 * Use this in layouts or components where you need to ensure context is loaded
 */
export function useInitializeOrganizationContext() {
  const context = useOrganizationContext();
  const accessToken = getAuthToken();
  useEffect(() => {
    if (accessToken && !context.isLoaded && !context.isLoading) {
      // The hook will automatically fetch if needed
      console.log("Organization context initialization requested");
    }
  }, [accessToken, context.isLoaded, context.isLoading]);

  return context;
}
