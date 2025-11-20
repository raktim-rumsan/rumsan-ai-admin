"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { OrganizationContextResponse } from "@/queries/organizationQuery";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  isOwner: boolean;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  joinedAt: string;
  isActive: boolean;
}

export interface PendingInvitation {
  token(token: any): void;
  id: string;
  email: string;
  role: string;
  organizationId: string;
  workspaceId?: string;
  invitedAt: string;
  expiresAt?: string;
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface OrganizationContextState {
  // State
  organizations: Organization[];
  workspaces: Workspace[];
  primaryOrganization: Organization | null;
  pendingInvitations: PendingInvitation[];
  userState: string | null;
  redirectTo: string | null;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  setContext: (data: OrganizationContextResponse["data"]) => void;
  clearContext: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Internal actions for hydration
  hydrate: (data: {
    organizations: Organization[];
    workspaces: Workspace[];
    primaryOrganization: Organization | null;
    pendingInvitations: PendingInvitation[];
    userState: string | null;
    redirectTo: string | null;
  }) => void;
}
export const useOrganizationStore = create<OrganizationContextState>()(
  devtools(
    (set) => ({
      // Initial state
      organizations: [],
      workspaces: [],
      primaryOrganization: null,
      pendingInvitations: [],
      userState: null,
      redirectTo: null,
      isLoaded: false,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Actions
      setContext: (data) => {
        // Handle both nested and flat data structures
        const organizations =
          data?.organizations?.all || data?.organizations || [];
        const workspaces =
          data?.workspaces?.accessible || data?.workspaces || [];
        const primaryOrganization =
          data?.organizations?.primary || data?.primaryOrganization || null;
        const pendingInvitations = data?.pendingInvitations || [];
        const userState = data?.userState || null;
        const redirectTo = data?.redirectTo || null;
        set(
          {
            organizations: Array.isArray(organizations) ? organizations : [],
            workspaces: Array.isArray(workspaces) ? workspaces : [],
            primaryOrganization,
            pendingInvitations: Array.isArray(pendingInvitations)
              ? pendingInvitations
              : [],
            userState,
            redirectTo,
            isLoaded: true,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          },
          false,
          "setContext"
        );

        // Persist to localStorage
        if (typeof window !== "undefined") {
          const persistData = {
            organizations: Array.isArray(organizations) ? organizations : [],
            workspaces: Array.isArray(workspaces) ? workspaces : [],
            primaryOrganization,
            pendingInvitations: Array.isArray(pendingInvitations)
              ? pendingInvitations
              : [],
            userState,
            redirectTo,
            lastFetched: Date.now(),
          };
          localStorage.setItem(
            "organizationContext",
            JSON.stringify(persistData)
          );

          // Also sync to cookie for middleware access
          const cookieData = {
            userState,
            primaryOrganization,
            organizations: Array.isArray(organizations) ? organizations : [],
          };
          const contextString = JSON.stringify(cookieData);
          document.cookie = `organizationContext=${encodeURIComponent(
            contextString
          )}; path=/; max-age=86400; SameSite=Lax`;
        }
      },

      clearContext: () => {
        set(
          {
            organizations: [],
            workspaces: [],
            primaryOrganization: null,
            pendingInvitations: [],
            userState: null,
            redirectTo: null,
            isLoaded: false,
            isLoading: false,
            error: null,
            lastFetched: null,
          },
          false,
          "clearContext"
        );

        // Clear from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("organizationContext");
          // Clear cookie as well
          document.cookie = "organizationContext=; path=/; max-age=0";
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, "setLoading");
      },

      setError: (error) => {
        set({ error, isLoading: false }, false, "setError");
      },

      // Internal hydration action (for SSR/client sync)
      hydrate: (data) => {
        set(
          {
            ...data,
            isLoaded: true,
            isLoading: false,
            error: null,
          },
          false,
          "hydrate"
        );
      },
    }),
    {
      name: "organization-store",
    }
  )
);

export const getRedirectPath = (redirectTo: string): string => {
  switch (redirectTo) {
    case "onboarding":
      return "/onboarding";
    case "admin":
      return "/admin";
    case "dashboard":
      return "/dashboard";
    default:
      return "/dashboard"; // fallback
  }
};

// Utility function to clear organization context (can be called from anywhere)
export const clearOrganizationContext = () => {
  useOrganizationStore.getState().clearContext();
};
