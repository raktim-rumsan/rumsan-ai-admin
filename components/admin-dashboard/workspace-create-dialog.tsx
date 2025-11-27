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
import { useRouter } from "next/navigation";
import { se } from "date-fns/locale";
import { SECTORS } from "@/constants/sector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function WorkspaceCreateDialog() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [sector, setSector] = useState("");

  const [workspaceDescription, setWorkspaceDescription] = useState("");

  const createWorkspace = useCreateWorkspace();

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return;

    createWorkspace.mutate(
      {
        name: workspaceName.trim(),
        description: workspaceDescription.trim(),
        sector: sector,
      },
      {
        onSuccess: ({ data }) => {
          setIsDialogOpen(false);
          setWorkspaceName("");
          setWorkspaceDescription("");
          router.push(`/admin/workspaces/${data.id}`);
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

          <div className="space-y-2">
            <Label htmlFor="sector"> Sector</Label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger id="sector" className="h-12 w-full">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the primary industry sector for your workspace
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace-description-2">
              Description (Optional)
            </Label>
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
          <Button
            onClick={handleCreateWorkspace}
            disabled={!workspaceName.trim()}
          >
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
