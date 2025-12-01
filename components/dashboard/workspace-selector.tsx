"use client";

import Link from "next/link";
import { Building2, ArrowRight, Users } from "lucide-react";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import { managementCardItem } from "../admin-dashboard/management-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

interface Workspace {
  id: string;
  name: string;
  sector: string;
  description: string;
  role: string;
}

export default function WorkspaceSelectorPage() {
  const { data: workspaceData, isLoading } = useWorkspaceQuery();
  const workspaceCount = workspaceData?.data?.myWorkspaces.length || 0;

  const getCardStats = (card: any) => {
    if (card.slug === "workspaces") {
      if (isLoading) return "Loading...";
      return `${workspaceCount} Active Workspace${
        workspaceCount !== 1 ? "s" : ""
      }`;
    }
    return card.stats;
  };
  // Mock data - replace with actual API call
  const workspaces: Workspace[] = [
    {
      id: "1",
      name: "Acme Corporation",
      sector: "banking",
      description: "Acme's Workspace is innovative and efficient.",
      role: "WORKSPACE_ADMIN",
    },
    {
      id: "2",
      name: "Tech Startup Inc",
      sector: "technology",
      description: "Tech Startup's Workspace is dynamic and fast-paced.",
      role: "WORKSPACE_MEMBER",
    },
    {
      id: "3",
      name: "Design Studio",
      sector: "design",
      description: "Design Studio's Workspace is creative and collaborative.",
      role: "WORKSPACE_OWNER",
    },
    {
      id: "4",
      name: "Marketing Agency",
      sector: "marketing",
      description:
        "Marketing Agency's Workspace is strategic and results-driven.",
      role: "WORKSPACE_MEMBER",
    },
  ];
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading workspaces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              User Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a workspace to continue working
            </p>
          </div>
        </div>
      </div>
      {/* <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"> */}
      {/* Header */}
      {/* <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
          Select a workspace
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a workspace to continue working
        </p>
      </div> */}

      {/* Workspaces Grid */}
      {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaceData?.data?.myWorkspaces?.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/dashboard?workspace=${workspace.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary">
                        {workspace.name}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {workspace.sector}
                      </span>
                    </div>
                  </div>

                  <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                    {workspace.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      {workspace._count?.users}{" "}
                      {workspace._count?.users === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div> */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {workspaceData?.data?.myWorkspaces?.map((workspace) => {
            const Icon = Building2;

            return (
              <Card
                key={workspace.id}
                className="group h-full transition-all relative hover:shadow-lg hover:border-primary/50 cursor-pointer"
                onClick={() => {
                  console.log(workspace.name);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-3 group-hover:bg-primary/10">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>

                        <p className="text-xs text-muted-foreground mt-1">
                          {getCardStats(workspace)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className=" flex text-sm leading-relaxed">
                    {workspace.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {workspaces.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
          <Building2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            No workspaces found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You are not a member of any workspace yet
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <Link
            href="/support"
            className="font-medium text-primary hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
    // </div>
  );
}
