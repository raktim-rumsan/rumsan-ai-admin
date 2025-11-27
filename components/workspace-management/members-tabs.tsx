"use client";
import { useState } from "react";
import { Plus, Trash2, Mail, User, RefreshCcw } from "lucide-react";
import {
  useDeleteWorkspaceMemberMutation,
  useInvitationWorkspaceMutation,
  useWorkspaceMemberQuery,
} from "@/queries/workspaceQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MembersTabsSkeleton from "./members-tabs-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Member } from "@/types/workspace-types";
import { useParams, useSearchParams } from "next/navigation";
import {
  useDeleteInvitation,
  useResendInvitation,
} from "@/queries/invitationsQuery";
import { getWorkspaceId, orgContext, formatRole } from "@/lib/utils";

interface Props {
  members?: Member[];
  setMembers?: (members: Member[]) => void;
  readOnly?: boolean;
}

export default function MembersTab({ readOnly = false }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [resendingInvitationId, setResendingInvitationId] = useState<
    string | null
  >(null);
  const [deletingInvitationId, setDeletingInvitationId] = useState<
    string | null
  >(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId") || "";

  // Get workspaceId from URL params or localStorage/context
  let workspaceId: string | undefined = params?.id as string | undefined;

  if (!workspaceId) {
    // No id in params, use slug from localStorage/context
    const workspaceSlug = getWorkspaceId();

    if (workspaceSlug) {
      const context = orgContext();
      const workspaces = context?.workspaces;

      if (workspaces && Array.isArray(workspaces)) {
        const matchedWorkspace = workspaces.find(
          (w: { slug: string; id: string }) => w.slug === workspaceSlug
        );
        workspaceId = matchedWorkspace?.id;
      }
    }
  }

  const invitationMutation = useInvitationWorkspaceMutation(workspaceId || "");
  const deleteWorkspaceMember = useDeleteWorkspaceMemberMutation();
  const deleteWorkspaceInvitation = useDeleteInvitation(workspaceId || "");

  const { data: WorkSpaceUsers, isLoading } = useWorkspaceMemberQuery(
    workspaceId || ""
  );

  const workspaceResendInvitation = useResendInvitation(workspaceId || "");

  const removeMember = async (email: string) => {
    if (!workspaceId) return;
    await deleteWorkspaceMember.mutateAsync({
      workspaceId: workspaceId,
      email,
    });
  };

  const handleSendInvitation = async () => {
    if (!email || !role) {
      return;
    }
    try {
      await invitationMutation.mutateAsync({
        email,
        role,
      });
      // Reset form and close dialog on success
      setEmail("");
      setRole("member");
      setIsDialogOpen(false);
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to send invitation:", error);
    }
  };

  const handleResendInvitation = async (
    invitationId: string,
    email: string,
    orgId: string,
    workspaceId: string
  ) => {
    try {
      setResendingInvitationId(invitationId);
      await workspaceResendInvitation.mutateAsync({
        invitationId,
        email,
        orgId,
        workspaceId,
      });
    } catch (error) {
      console.error("Failed to resend invitation:", error);
    } finally {
      setResendingInvitationId(null);
    }
  };

  const removeWorkspaceInvitation = async (invitationId: string) => {
    try {
      setDeletingInvitationId(invitationId);
      await deleteWorkspaceInvitation.mutateAsync(invitationId);
    } catch (error) {
      console.error("Failed to delete invitation:", error);
    } finally {
      setDeletingInvitationId(null);
    }
  };

  if (!workspaceId) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Unable to load workspace. Please select a workspace first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return isLoading ? (
    <MembersTabsSkeleton />
  ) : (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription className="mt-2">
                  {!readOnly
                    ? "Manage who has access to this workspace"
                    : "You can view the members and invitations in this workspace."}
                </CardDescription>
              </div>
              {!readOnly && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join this workspace
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="member@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={role} onValueChange={setRole}>
                            <SelectTrigger id="role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        className={`w-fit ${
                          invitationMutation.isPending ? "animate-pulse" : ""
                        }`}
                        onClick={handleSendInvitation}
                        disabled={
                          !email || !role || invitationMutation.isPending
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {invitationMutation.isPending
                          ? "Sending..."
                          : "Send Invitation"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {WorkSpaceUsers && WorkSpaceUsers?.data?.members
                ? WorkSpaceUsers.data.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {member?.user.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {formatRole(member.role)}
                        </Badge>
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              removeMember(member.user.email);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </CardContent>
          <CardContent className="pt-0 pl-4 pr-4 pb-4">
            <div className="space-y-4">
              {WorkSpaceUsers && WorkSpaceUsers?.data?.invitations
                ? WorkSpaceUsers.data.invitations.map((invitations) => (
                    <div
                      key={invitations.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {invitations.email}
                            <Badge
                              className="ml-2 bg-yellow-400 text-white border-yellow-200"
                              variant="outline"
                            >
                              {invitations.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Invited By: {invitations?.invitedBy?.full_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {formatRole(invitations.role)}
                        </Badge>
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleResendInvitation(
                                invitations.id as string,
                                invitations.email as string,
                                orgId,
                                workspaceId as string
                              );
                            }}
                            className={`hover:bg-transparent cursor-pointer p-0 ${
                              resendingInvitationId === invitations.id &&
                              workspaceResendInvitation.isPending
                                ? "opacity-70"
                                : ""
                            }`}
                            disabled={
                              resendingInvitationId === invitations.id &&
                              workspaceResendInvitation.isPending
                            }
                            aria-label="Resend invitation"
                          >
                            <RefreshCcw
                              color="#cdd016"
                              className={`h-4 w-4 ${
                                resendingInvitationId === invitations.id &&
                                workspaceResendInvitation.isPending
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </Button>
                        )}
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              removeWorkspaceInvitation(
                                invitations.id as string
                              );
                            }}
                            className={`text-destructive hover:bg-transparent cursor-pointer p-0 ${
                              deletingInvitationId === invitations.id &&
                              deleteWorkspaceInvitation.isPending
                                ? "opacity-70"
                                : ""
                            }`}
                            disabled={
                              deletingInvitationId === invitations.id &&
                              deleteWorkspaceInvitation.isPending
                            }
                            aria-label="Delete invitation"
                          >
                            <Trash2
                              className={`h-4 w-4 ${
                                deletingInvitationId === invitations.id &&
                                deleteWorkspaceInvitation.isPending
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
