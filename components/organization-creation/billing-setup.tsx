"use client";

import { useState } from "react";
import { CreditCard, ArrowRight, Check, MoveLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillingSetupProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function BillingSetup({
  onComplete,
  onSkip,
  onBack,
}: BillingSetupProps) {
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "pro" | "enterprise"
  >("free");
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["Up to 5 team members", "Basic features", "Community support"],
      disabled: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited team members",
        "Advanced features",
        "Priority support",
        "Custom integrations",
      ],
      popular: true,
      disabled: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "SLA guarantee",
        "Custom contracts",
      ],
      disabled: true,
    },
  ];

  const handleContinue = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onComplete();
  };

  return (
    <Card className="w-full max-w-4xl p-8">
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
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Choose your plan
          </h1>
          <p className="text-muted-foreground text-balance">
            Select the plan that best fits your team's needs. You can change
            this anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() =>
                !plan.disabled &&
                setSelectedPlan(plan.id as typeof selectedPlan)
              }
              disabled={plan.disabled} // Disable button for pro and enterprise
              className={`
                relative p-6 rounded-lg border-2 transition-all text-left
                ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : plan.disabled
                    ? "border-border bg-muted/50 opacity-60 cursor-not-allowed"
                    : "border-border hover:border-primary/50 bg-card"
                }
              `}>
              {plan.disabled && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted-foreground text-background text-xs font-medium rounded-full">
                  Coming Soon
                </span>
              )}
              {plan.popular && !plan.disabled && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedPlan === plan.id && !plan.disabled && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Payment info (only show if not free plan) */}
        {selectedPlan !== "free" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1 bg-transparent"
            disabled={isLoading}>
            Skip for now
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can update your billing information anytime in settings
        </p>
      </div>
    </Card>
  );
}
