"use client";
import { Building2, FolderKanbanIcon, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clearChatHistory } from "@/queries/chatQuery";
import DashboardLoader from "./dashboard-loading";

export default function WorkspaceSelectorPage() {
  const { data: workspaceData, isLoading } = useWorkspaceQuery();

  if (typeof window !== "undefined") {
    localStorage.removeItem("workspaceId");
    clearChatHistory();
  }

  return (
    <>
      {isLoading ? (
        <DashboardLoader />
      ) : (
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

          {/* Workspaces Grid */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workspaceData?.data?.myWorkspaces?.map((workspace) => {
                return (
                  <Link
                    key={workspace.id}
                    href={`/dashboard/workspace/${workspace.slug}`}
                  >
                    <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-teal-500 p-3">
                              <FolderKanbanIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <CardTitle className="text-lg">
                                {workspace.name}
                              </CardTitle>
                              {workspace.organization?.name && (
                                <p className="text-xs text-muted-foreground">
                                  {workspace.organization.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={
                              workspace.isActive ? "default" : "secondary"
                            }
                          >
                            {workspace.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {workspace.description && (
                          <CardDescription className="text-sm leading-relaxed mt-2">
                            {workspace.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {workspace._count?.users === 1
                                ? "member"
                                : "members"}
                            </span>
                          </div>
                          {workspace.sector && (
                            <Badge variant="outline" className="text-xs">
                              {workspace.sector}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
          {/* Empty State */}
          {workspaceData?.data?.myWorkspaces.length === 0 && (
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
        </div>
      )}
    </>
  );
}
