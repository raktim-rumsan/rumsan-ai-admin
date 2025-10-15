"use client";

import { useState } from "react";
import { Users, Mail, X, ArrowRight, Plus, MoveLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastUtils } from "@/lib/toast-utils";

interface InviteTeammatesProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

interface Invite {
  id: string;
  email: string;
}

export function InviteTeammates({
  onComplete,
  onSkip,
  onBack,
}: InviteTeammatesProps) {
  const [invites, setInvites] = useState<Invite[]>([{ id: "1", email: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const addInvite = () => {
    setInvites([...invites, { id: Date.now().toString(), email: "" }]);
  };

  const removeInvite = (id: string) => {
    if (invites.length > 1) {
      setInvites(invites.filter((invite) => invite.id !== id));
    }
  };

  const updateInvite = (id: string, email: string) => {
    setInvites(
      invites.map((invite) =>
        invite.id === id ? { ...invite, email } : invite
      )
    );
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvites = async () => {
    const validEmails = invites.filter(
      (invite) => invite.email.trim() && isValidEmail(invite.email.trim())
    );

    // Check for invalid emails and show specific warnings
    const invalidEmails = invites.filter(
      (invite) => invite.email.trim() && !isValidEmail(invite.email.trim())
    );

    if (invalidEmails.length > 0) {
      invalidEmails.forEach((invite) => {
        toastUtils.invitations.invalidEmail(invite.email);
      });
      return;
    }

    if (validEmails.length === 0) {
      toastUtils.invitations.noValidEmails();
      return;
    }

    setIsLoading(true);

    try {
      // Show loading toast
      toastUtils.invitations.sendingStarted(validEmails.length);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success toast
      toastUtils.invitations.sendSuccess(validEmails.length);

      onComplete();
    } catch {
      toastUtils.invitations.sendError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <div className="space-y-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="pl-0 hover:bg-transparent cursor-pointer gap-0">
            <MoveLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-2">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Invite your team
          </h1>
          <p className="text-muted-foreground text-balance">
            Collaborate better by inviting your teammates to join your
            organization
          </p>
        </div>

        {/* Invite form */}
        <div className="space-y-3">
          <Label className="text-foreground">Team member emails</Label>
          {invites.map((invite) => (
            <div key={invite.id} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={invite.email}
                  onChange={(e) => updateInvite(invite.id, e.target.value)}
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
              {invites.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeInvite(invite.id)}
                  disabled={isLoading}
                  className="h-11 w-11 flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addInvite}
            disabled={isLoading}
            className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add another teammate
          </Button>
        </div>

        {/* Benefits */}
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Why invite your team now?
          </p>
          <ul className="space-y-2">
            {[
              "Get everyone on the same page from day one",
              "Start collaborating immediately",
              "Set up team permissions and roles",
            ].map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1 bg-transparent"
            disabled={isLoading}>
            Skip for now
          </Button>
          <Button
            onClick={handleSendInvites}
            className="flex-1"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Sending invites...
              </>
            ) : (
              <>
                Send invitations
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can invite more teammates later from your organization settings
        </p>
      </div>
    </Card>
  );
}
