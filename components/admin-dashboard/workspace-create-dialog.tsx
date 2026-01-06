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
import { SECTORS } from "@/constants/sector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

interface WorkspaceCreateDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function WorkspaceCreateDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
}: WorkspaceCreateDialogProps = {}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  const isDialogOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsDialogOpen = externalOnOpenChange || setInternalOpen;
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceNameError, setWorkspaceNameError] = useState("");
  const [sector, setSector] = useState("");

  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceDescriptionError, setWorkspaceDescriptionError] =
    useState("");

  const createWorkspace = useCreateWorkspace();
  const organizationContext = useOrganizationContext();

  const validateWorkspaceName = (value: string) => {
    if (value.length > 50) {
      setWorkspaceNameError("Workspace name cannot exceed 50 characters");
      return false;
    }
    setWorkspaceNameError("");
    return true;
  };

  const validateDescription = (value: string) => {
    if (value.length > 250) {
      setWorkspaceDescriptionError("Description cannot exceed 250 characters");
      return false;
    }
    setWorkspaceDescriptionError("");
    return true;
  };

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setWorkspaceName(value);
    if (value.length > 50) {
      setWorkspaceNameError("Workspace name cannot exceed 50 characters");
    } else {
      setWorkspaceNameError("");
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setWorkspaceDescription(value);
    if (value.length > 250) {
      setWorkspaceDescriptionError("Description cannot exceed 250 characters");
    } else {
      setWorkspaceDescriptionError("");
    }
  };

  const handleCreateWorkspace = () => {
    if (
      !workspaceName.trim() ||
      !validateWorkspaceName(workspaceName) ||
      !validateDescription(workspaceDescription)
    ) {
      return;
    }
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
          setWorkspaceNameError("");
          setWorkspaceDescription("");
          setWorkspaceDescriptionError("");
          organizationContext.refetch();
          router.push(`/admin/workspaces/${data.slug}`);
        },
      }
    );
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setWorkspaceName("");
          setWorkspaceNameError("");
          setWorkspaceDescription("");
          setWorkspaceDescriptionError("");
          setSector("");
        }
      }}
    >
      {externalOpen === undefined &&
        (trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Button className="mt-6 mx-auto" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </DialogTrigger>
        ))}
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
              onChange={handleWorkspaceNameChange}
              className={workspaceNameError ? "border-red-500" : ""}
            />
            {workspaceNameError && (
              <p className="text-sm text-red-500">{workspaceNameError}</p>
            )}
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
              onChange={handleDescriptionChange}
              rows={3}
              className={workspaceDescriptionError ? "border-red-500" : ""}
            />
            {workspaceDescriptionError && (
              <p className="text-sm text-red-500">
                {workspaceDescriptionError}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateWorkspace}
            disabled={
              !workspaceName.trim() ||
              !!workspaceNameError ||
              !!workspaceDescriptionError
            }
          >
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
