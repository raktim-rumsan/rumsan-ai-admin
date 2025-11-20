"use client";

import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingSuccessProps {
  organizationName: string;
  onComplete?: () => void;
  isRedirecting?: boolean;
}

export function OnboardingSuccess({
  organizationName,
  onComplete,
  isRedirecting = false,
}: OnboardingSuccessProps) {
  return (
    <Card className="w-full max-w-lg p-8">
      <div className="space-y-6 text-center">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            You&apos;re all set!
          </h1>
          <p className="text-muted-foreground text-balance">
            {organizationName
              ? `${organizationName} is ready to go.`
              : "Your organization is ready to go."}{" "}
            Let&apos;s start building something amazing together.
          </p>
        </div>

        {/* Quick actions */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-12 text-base"
            size="lg"
            onClick={onComplete}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                Go to dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Next steps */}
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-left">
          <p className="text-sm font-medium text-foreground">
            Recommended next steps:
          </p>
          <ul className="space-y-2">
            {[
              "Create your first workspace",
              "Invite new members to the workspace",
              "Set up integrations and tools",
            ].map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
