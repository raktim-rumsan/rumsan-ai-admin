"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useOrgSettings, OrgSettings } from "@/queries/orgSettingsQuery";

interface OrgContextType {
  orgSettings: OrgSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
};

interface OrgProviderProps {
  children: ReactNode;
}

export const OrgProvider: React.FC<OrgProviderProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: orgSettings, isLoading, error, refetch } = useOrgSettings();

  useEffect(() => {
    setIsMounted(true);
    // Trigger the query only after component mounts (client-side)
    if (typeof window !== "undefined") {
      refetch();
    }
  }, [refetch]);

  const value: OrgContextType = {
    orgSettings: isMounted ? orgSettings : undefined,
    isLoading: isMounted ? isLoading : true,
    error: isMounted ? error : null,
    refetch,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};
