import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/queries/workspaceQuery";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function WorkspaceCreateDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");

  const createWorkspace = useCreateWorkspace();

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return;

    createWorkspace.mutate(
      {
        name: workspaceName.trim(),
        description: workspaceDescription.trim(),
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setWorkspaceName("");
          setWorkspaceDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 mx-auto" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Enter details for your new workspace. You can change these later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name-2">Workspace Name</Label>
            <Input
              id="workspace-name-2"
              placeholder="e.g., Marketing Team"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace-description-2">Description (Optional)</Label>
            <Textarea
              id="workspace-description-2"
              placeholder="Describe the purpose of this workspace..."
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateWorkspace} disabled={!workspaceName.trim()}>
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
