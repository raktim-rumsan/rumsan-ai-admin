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
  id: string;
  email: string;
  role: string;
  organizationId: string;
  workspaceId?: string;
  invitedAt: string;
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
        console.log("Organization store setContext called with:", data);
        console.log("Organizations structure:", data.organizations);
        console.log("Workspaces structure:", data.workspaces);

        set(
          {
            organizations: data.organizations?.all || [],
            workspaces: data.workspaces?.accessible || [],
            primaryOrganization: data.organizations?.primary || null,
            pendingInvitations: data.pendingInvitations || [],
            userState: data.userState || null,
            redirectTo: data.redirectTo || null,
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
            organizations: data.organizations?.all || [],
            workspaces: data.workspaces?.accessible || [],
            primaryOrganization: data.organizations?.primary || null,
            pendingInvitations: data.pendingInvitations || [],
            userState: data.userState || null,
            redirectTo: data.redirectTo || null,
            lastFetched: Date.now(),
          };
          localStorage.setItem(
            "organizationContext",
            JSON.stringify(persistData)
          );

          // Also sync to cookie for middleware access
          const cookieData = {
            userState: data.userState || null,
            primaryOrganization: data.organizations?.primary || null,
            organizations: data.organizations?.all || [],
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
