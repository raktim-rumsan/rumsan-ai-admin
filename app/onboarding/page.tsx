"use client";

import { BillingSetup } from "@/components/organization-creation/billing-setup";
import { InviteTeammates } from "@/components/organization-creation/invite-teammates";
import { OnboardingSuccess } from "@/components/organization-creation/onboarding-success";
import { OrganizationCheck } from "@/components/organization-creation/organization-check";
import { OrganizationForm } from "@/components/organization-creation/organiztion-form";
import { StepIndicator } from "@/components/organization-creation/step-indicator";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type OnboardingStep =
  | "checking"
  | "organization"
  | "billing"
  | "invite"
  | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("organization");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    // Tenant functionality has been removed - skip directly to organization setup
    // This could be modified to check organization status from a different source if needed
    console.log("Tenant functionality removed - proceeding with onboarding");
  }, []);

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

  const handleOnboardingComplete = () => {
    // After onboarding is complete, redirect to admin dashboard
    router.push("/admin");
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
        />
      )}
    </div>
  );
}
