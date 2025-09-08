"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastUtils } from "@/lib/toast-utils";
import { USER_ROLES } from "@/lib/constants";
import { useAddOrgUserMutation } from "@/queries/invitationQuery";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess: () => void;
}

export function AddMemberModal({ isOpen, onClose, onInviteSuccess }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);

const inviteMutation = useAddOrgUserMutation(() => { 
  onClose();
  setEmail(""); 
  setRole("member"); 
  setIsSubmitting(false);
  toastUtils.generic.success("Invitation sent", `Invited ${email} as ${role}`);
});

const handleInvite = () => {
  if (!email) {
    toastUtils.generic.error("Email required", "Please enter the member's email");
    return;
  }

  setIsSubmitting(true);

  // Call the mutation
  inviteMutation.mutate({ email, role }, {
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to invite user";
      toastUtils.generic.error("Invitation failed", message);
      setIsSubmitting(false);
    },
  });
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Invite Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map(role => (
                  <SelectItem key={role} value={role.toLowerCase()}>{role.charAt(0) + role.slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleInvite}
            disabled={isSubmitting || !email}
             className="w-full bg-gray-600 hover:bg-gray-700"
          >
            {isSubmitting ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
