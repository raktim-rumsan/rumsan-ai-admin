"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateOrgMutation } from "@/queries/tenantQuery";
import { useSetTenantId } from "@/stores/tenantStore";
import { Loader2 } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamCreated?: (teamSlug: string) => void;
}

export function CreateTeamDialog({ open, onOpenChange, onTeamCreated }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const createOrgMutation = useCreateOrgMutation({
    onSuccess: async (result: unknown) => {
      const data = result as { data?: { slug?: string } };
      const slug = data?.data?.slug;
      if (slug) {
        // Small delay to ensure query refetch completes
        setTimeout(() => {
          setTenantId(slug);
          localStorage.setItem("tenantId", slug);
          onTeamCreated?.(slug);
          // Reload the entire website to refresh all data and state
          window.location.reload();
        }, 100);
      }
    },
  });
  const setTenantId = useSetTenantId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      await createOrgMutation.mutateAsync({
        name: teamName.trim(),
        description: teamDescription.trim(),
      });
      setTeamName("");
      setTeamDescription("");
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleClose = () => {
    setTeamName("");
    setTeamDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team workspace. You can invite team members later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-name" className="text-right">
                Team Name
              </Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="col-span-3"
                disabled={createOrgMutation.isPending}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-name" className="text-right">
                Team Description
              </Label>
              <Input
                id="team-description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Enter team description"
                className="col-span-3"
                disabled={createOrgMutation.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createOrgMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!teamName.trim() || createOrgMutation.isPending}>
              {createOrgMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
