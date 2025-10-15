"use client";

import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OrganizationCheck() {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative">
          <Building2 className="h-16 w-16 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Setting up your workspace
          </h2>
          <p className="text-muted-foreground text-balance">
            We're checking your organization status. This will only take a
            moment.
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{
              width: "0%",
              animation: "progress 2s ease-in-out forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </Card>
  );
}
