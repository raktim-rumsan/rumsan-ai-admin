"use client";

import { Building2, CreditCard, Users } from "lucide-react";

interface StepIndicatorProps {
  currentStep: "organization" | "billing" | "invite";
  completedSteps: string[];
}

export function StepIndicator({
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  const steps = [
    { id: "organization", label: "Organization", icon: Building2, number: 1 },
    { id: "billing", label: "Billing", icon: CreditCard, number: 2 },
    { id: "invite", label: "Invite Team", icon: Users, number: 3 },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative">
        {/* Background line connecting all steps */}
        <div
          className="absolute top-5 left-0 right-0 h-1 bg-muted/30 rounded-full"
          style={{
            left: "calc(5% + 20px)",
            right: "calc(5% + 20px)",
          }}
        />

        <div
          className="absolute top-5 h-1 bg-primary rounded-full transition-all duration-700 ease-in-out"
          style={{
            left: "calc(5% + 20px)",
            width: `calc(${
              (currentStepIndex / (steps.length - 1)) * 90
            }% - 20px)`,
          }}
        />

        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex && !isCompleted;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 relative z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    transition-all duration-500 border-2
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : ""
                    }
                    ${
                      isCurrent
                        ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 animate-bounce"
                        : ""
                    }
                    ${
                      isPending
                        ? "bg-background border-muted text-muted-foreground"
                        : ""
                    }
                  `}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`
                      text-sm font-medium transition-colors duration-300 text-center
                      ${isCompleted ? "text-primary" : ""}
                      ${isCurrent ? "text-foreground" : ""}
                      ${isPending ? "text-muted-foreground" : ""}
                    `}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
