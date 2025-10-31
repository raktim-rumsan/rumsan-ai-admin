import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Workspace } from "@/types/workspace-types";

interface Props {
  workspace: Workspace;
}

export default function WorkspaceHeader({ workspace }: Props) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-6 py-4 flex items-start justify-between">
        <div>
          <Link
            href="/admin/workspaces"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Workspaces
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className={`rounded-lg ${workspace.color} p-3`}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {workspace.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {workspace.description}
              </p>
            </div>
          </div>
        </div>
        <Badge
          variant={workspace.status === "active" ? "default" : "secondary"}
        >
          {workspace.status}
        </Badge>
      </div>
    </div>
  );
}
