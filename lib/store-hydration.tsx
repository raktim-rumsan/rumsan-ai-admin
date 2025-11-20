"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useOrgSettingsStore } from "@/stores/orgSettingsStore";
import { useDocumentsStore } from "@/stores/documentsStore";
import { useOrganizationStore } from "@/stores/organizationStore";
import type { UserProfile, User, OrgSettings, Document } from "@/lib/schemas";
import type {
  Organization,
  Workspace,
  PendingInvitation,
} from "@/stores/organizationStore";

interface HydrationData {
  user?: {
    user: User | null;
    userProfile: UserProfile | null;
  };
  orgSettings?: {
    orgSettings: OrgSettings | null;
  };
  documents?: {
    documents: Document[];
  };
  organization?: {
    organizations: Organization[];
    workspaces: Workspace[];
    primaryOrganization: Organization | null;
    pendingInvitations: PendingInvitation[];
    userState: string | null;
    lastFetched?: number;
  };
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/sign-up",
  "/auth/verify-otp",
  "/auth/sign-up-success",
];

// Check if the current route is a public route
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/widget");
};

/**
 * Hook to hydrate Zustand stores from server-side data in Next.js 15 app router
 * Should be called once in the root layout or main app component
 */
export function useStoreHydration(
  data?: HydrationData,
  shouldInitializeAuth = true
) {
  const pathname = usePathname();
  const userStore = useUserStore();
  const orgSettingsStore = useOrgSettingsStore();
  const documentsStore = useDocumentsStore();
  const organizationStore = useOrganizationStore();

  // Use refs to track initialization to prevent infinite loops
  const initializationRef = useRef({
    userHydrated: false,
    orgSettingsHydrated: false,
    documentsHydrated: false,
    organizationHydrated: false,
    authInitialized: false,
  });

  useEffect(() => {
    const init = initializationRef.current;

    // Only hydrate if we have data and stores haven't been initialized
    if (data?.user && !userStore.isInitialized && !init.userHydrated) {
      userStore.hydrate(data.user);
      init.userHydrated = true;
    }

    if (
      data?.orgSettings &&
      !orgSettingsStore.isInitialized &&
      !init.orgSettingsHydrated
    ) {
      orgSettingsStore.hydrate(data.orgSettings);
      init.orgSettingsHydrated = true;
    }

    if (
      data?.documents &&
      !documentsStore.isInitialized &&
      !init.documentsHydrated
    ) {
      documentsStore.hydrate(data.documents);
      init.documentsHydrated = true;
    }

    if (
      data?.organization &&
      !organizationStore.isLoaded &&
      !init.organizationHydrated
    ) {
      organizationStore.hydrate(data.organization);
      init.organizationHydrated = true;
    }

    // Only initialize auth if not on a public route and shouldInitializeAuth is true
    const isOnPublicRoute = isPublicRoute(pathname);

    if (
      !data?.user &&
      !userStore.isInitialized &&
      shouldInitializeAuth &&
      !isOnPublicRoute &&
      !init.authInitialized
    ) {
      userStore.initializeAuth();
      init.authInitialized = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shouldInitializeAuth, pathname]);
}

/**
 * Client component that handles store initialization
 * Use this in your layout.tsx after QueryProvider
 */
export function StoreInitializer({
  children,
  hydrationData,
  shouldInitializeAuth = true,
}: {
  children: React.ReactNode;
  hydrationData?: HydrationData;
  shouldInitializeAuth?: boolean;
}) {
  useStoreHydration(hydrationData, shouldInitializeAuth);

  return <>{children}</>;
}

/**
 * Utility to prepare hydration data on the server side
 * Call this in your server components to prepare initial state
 */
export async function prepareHydrationData(): Promise<HydrationData> {
  // In a real implementation, you would fetch initial data here
  // For now, we'll return empty data and let client-side initialization handle it
  return {};
}

/**
 * Hook to get current workspace orchestrator with query client integration
 * Use this in components that need to switch workspaces
 */
export function useWorkspaceSwitcher() {
  // Workspace switching functionality removed - tenantStore no longer available
  return {
    switchWorkspace: () => {
      console.warn(
        "Workspace switching is not available - tenantStore has been removed"
      );
    },
  };
}

/**
 * Function to manually initialize authentication after successful login
 * Call this after user verification/login is complete
 */
export function initializeAuthAfterLogin() {
  import("@/stores/userStore").then(({ useUserStore }) => {
    const userStore = useUserStore.getState();
    if (!userStore.isInitialized) {
      userStore.initializeAuth();
    }
  });
}

export function initializeOrganizationContext() {
  if (typeof window === "undefined") return;

  import("@/stores/organizationStore").then(({ useOrganizationStore }) => {
    const orgStore = useOrganizationStore.getState();

    // Only hydrate if not already loaded
    if (!orgStore.isLoaded) {
      const savedContext = localStorage.getItem("organizationContext");
      if (savedContext) {
        try {
          const parsedContext = JSON.parse(savedContext);
          const CACHE_DURATION = 5 * 60 * 1000;
          const isStale =
            !parsedContext.lastFetched ||
            Date.now() - parsedContext.lastFetched > CACHE_DURATION;
          if (!isStale) {
            orgStore.hydrate(parsedContext);
          } else {
            localStorage.removeItem("organizationContext");
          }
        } catch (error) {
          console.error("Failed to parse saved organization context:", error);
          localStorage.removeItem("organizationContext");
        }
      }
    }
  });
}
