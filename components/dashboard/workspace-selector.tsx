"use client";
import { Building2, ArrowRight, Users } from "lucide-react";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { clearChatHistory } from "@/queries/chatQuery";
import DashboardLoader from "./dashboard-loading";

export default function WorkspaceSelectorPage() {
  const router = useRouter();
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {workspaceData?.data?.myWorkspaces?.map((workspace) => {
                const Icon = Building2;

                return (
                  <Card
                    key={workspace.id}
                    className="group h-full transition-all relative hover:shadow-lg hover:border-primary/50 cursor-pointer"
                    onClick={() => {
                      router.push(`/dashboard/workspace/${workspace.slug}`);
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
                            {workspace.sector && (
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
                                {workspace.sector}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="flex text-sm leading-relaxed mb-4">
                        {workspace.description}
                      </CardDescription>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          {workspace._count?.users}{" "}
                          {workspace._count?.users === 1 ? "member" : "members"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
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
