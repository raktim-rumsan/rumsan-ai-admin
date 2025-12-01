"use client";

import Link from "next/link";
import { Building2, ArrowRight, Users } from "lucide-react";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import WorkspaceSelectorPage from "@/components/dashboard/workspace-selector";

interface Workspace {
  id: string;
  name: string;
  sector: string;
  description: string;
  role: string;
}

export default function WorkspaceDashboard() {
  return <WorkspaceSelectorPage />;
}
