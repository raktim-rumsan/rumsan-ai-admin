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
