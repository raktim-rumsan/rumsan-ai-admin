import { FolderKanban, Plus, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WorkspacesPage() {
  const workspaces = [
    {
      id: "1",
      name: "Customer Support",
      description: "AI assistant for customer inquiries and support tickets",
      members: 12,
      messages: 1543,
      status: "active",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Banking Operations",
      description: "Internal banking operations and compliance queries",
      members: 8,
      messages: 892,
      status: "active",
      color: "bg-teal-500",
    },
    {
      id: "3",
      name: "Product Information",
      description: "Product details, pricing, and feature information",
      members: 5,
      messages: 634,
      status: "active",
      color: "bg-purple-500",
    },
  ];

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
                Manage your AI workspaces and teams
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href={`/admin/workspaces/${workspace.id}`}>
              <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`rounded-lg ${workspace.color} p-3`}>
                      <FolderKanban className="h-6 w-6 text-white" />
                    </div>
                    <Badge
                      variant={
                        workspace.status === "active" ? "default" : "secondary"
                      }
                    >
                      {workspace.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2">
                    {workspace.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{workspace.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{workspace.messages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State for New Workspace */}
        <Card className="mt-6 border-dashed">
          <CardHeader className="text-center py-12">
            <div className="mx-auto mb-4 rounded-full bg-muted p-4 w-fit">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Create a New Workspace</CardTitle>
            <CardDescription className="mt-2">
              Set up a new workspace for your team to collaborate and manage AI
              assistants
            </CardDescription>
            <Button className="mt-4 mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
