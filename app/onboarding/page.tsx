"use client";

import { BillingSetup } from "@/components/organization-creation/billing-setup";
import { InviteTeammates } from "@/components/organization-creation/invite-teammates";
import { OnboardingSuccess } from "@/components/organization-creation/onboarding-success";
import { OrganizationCheck } from "@/components/organization-creation/organization-check";
import { OrganizationForm } from "@/components/organization-creation/organiztion-form";
import { StepIndicator } from "@/components/organization-creation/step-indicator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { getRedirectPath } from "@/stores/organizationStore";

type OnboardingStep =
  | "checking"
  | "organization"
  | "billing"
  | "invite"
  | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const organizationContext = useOrganizationContext();
  const [step, setStep] = useState<OnboardingStep>("organization");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleOrganizationCreated = (name: string) => {
    setOrganizationName(name);
    setCompletedSteps((prev) => [...prev, "organization"]);
    setStep("billing");
  };

  const handleBillingComplete = () => {
    setCompletedSteps((prev) => [...prev, "billing"]);
    setStep("invite");
  };

  const handleInviteComplete = () => {
    setCompletedSteps((prev) => [...prev, "invite"]);
    setStep("complete");
  };

  const handleOnboardingComplete = async () => {
    setIsRedirecting(true);

    try {
      // Refetch organization context to get updated redirectTo value
      let redirectTo = "dashboard";
      let contextData = null;

      if (organizationContext.refetch) {
        const result = await organizationContext.refetch();
        // Get redirectTo from the refetch result
        if (result && result.data) {
          redirectTo = result.data.redirectTo || "dashboard";
          contextData = result.data;
        }
      }

      // Manually set the cookie to ensure middleware sees it
      if (contextData) {
        const cookieData = {
          userState: contextData.userState || null,
          primaryOrganization: contextData.organizations?.primary || null,
          organizations: contextData.organizations?.all || [],
        };
        const contextString = JSON.stringify(cookieData);
        document.cookie = `organizationContext=${encodeURIComponent(
          contextString
        )}; path=/; max-age=86400; SameSite=Lax`;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      const redirectPath = getRedirectPath(redirectTo);
      window.location.href = redirectPath;
    } catch (error) {
      console.error("Error during onboarding completion:", error);
      window.location.href = "/dashboard";
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleBack = () => {
    if (step === "billing") {
      setCompletedSteps((prev) => prev.filter((s) => s !== "organization"));
      setStep("organization");
    } else if (step === "invite") {
      setCompletedSteps((prev) => prev.filter((s) => s !== "billing"));
      setStep("billing");
    }
  };

  const showStepIndicator = step !== "checking" && step !== "complete";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-8">
      {showStepIndicator && (
        <StepIndicator currentStep={step} completedSteps={completedSteps} />
      )}

      {step === "checking" && <OrganizationCheck />}
      {step === "organization" && (
        <OrganizationForm onSuccess={handleOrganizationCreated} />
      )}
      {step === "billing" && (
        <BillingSetup
          onComplete={handleBillingComplete}
          onSkip={handleBillingComplete}
          onBack={handleBack}
        />
      )}
      {step === "invite" && (
        <InviteTeammates
          onComplete={handleInviteComplete}
          onSkip={handleInviteComplete}
          onBack={handleBack}
        />
      )}
      {step === "complete" && (
        <OnboardingSuccess
          organizationName={organizationName}
          onComplete={handleOnboardingComplete}
          isRedirecting={isRedirecting}
        />
      )}
    </div>
  );
}
