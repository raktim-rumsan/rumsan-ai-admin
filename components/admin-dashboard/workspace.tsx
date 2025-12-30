import { FolderKanban, Plus, Users } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import { WorkspacesLoadingGrid } from "./workspace-skeleton";
import WorkspaceCreateDialog from "./workspace-create-dialog";

export default function WorkspacesPage() {
  const { data: workspaceData, isLoading } = useWorkspaceQuery();

  const adminWorkspaces =
    workspaceData?.data?.myWorkspaces
      ?.filter((workspace) => workspace.userRole !== "WORKSPACE_MEMBER")
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                Workspace Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your AI workspaces
              </p>
            </div>
            <div className="shrink-0">
              {adminWorkspaces.length > 0 && <WorkspaceCreateDialog />}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <WorkspacesLoadingGrid />
        ) : (
          <>
            {adminWorkspaces.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {adminWorkspaces.map((workspace) => (
                  <Link
                    key={workspace.id}
                    href={`/admin/workspaces/${workspace.slug}`}
                  >
                    <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-teal-500 p-3">
                              <FolderKanban className="h-6 w-6 text-white" />
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
                                ? `${workspace._count?.users} member`
                                : `${workspace._count?.users} members`}
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
                ))}
              </div>
            )}

            {/* Empty State for New Workspace */}
            {adminWorkspaces.length === 0 && (
              <Card className="mt-6 border-dashed">
                <CardHeader className="text-center py-16">
                  <div className="mx-auto mb-6 rounded-full bg-muted p-6 w-fit">
                    <Plus className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl mb-3">
                    {adminWorkspaces.length === 0
                      ? "Create Your First Workspace"
                      : "Create a New Workspace"}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed max-w-md mx-auto">
                    {adminWorkspaces.length === 0
                      ? "Get started by setting up a workspace where your team can collaborate and manage AI assistants together"
                      : "Set up a new workspace for your team to collaborate and manage AI assistants"}
                  </CardDescription>
                  <WorkspaceCreateDialog />
                </CardHeader>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
