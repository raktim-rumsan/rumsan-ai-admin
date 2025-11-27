"use client";

import type React from "react";

import { useState } from "react";
import { Building2, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastUtils } from "@/lib/toast-utils";
import { useOrganizationMutation } from "@/queries/organizationQuery";
import { SECTORS } from "@/constants/sector";

interface OrganizationFormProps {
  onSuccess: (organizationName: string) => void;
}

export function OrganizationForm({ onSuccess }: OrganizationFormProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [sector, setSector] = useState<string>("");

  const organizationMutation = useOrganizationMutation(() => {
    onSuccess(organizationName);
  });

  const handleNameChange = (value: string) => {
    setOrganizationName(value);
    // Auto-generate slug from name
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationName.trim()) {
      toastUtils.generic.error(
        "Organization name required",
        "Please enter a name for your organization."
      );
      return;
    }

    if (!sector) {
      toastUtils.generic.error(
        "Sector required",
        "Please select a sector for your organization."
      );
      return;
    }

    organizationMutation.mutate({
      name: organizationName,
      sector: sector,
    });
  };

  return (
    <Card className="w-full max-w-lg p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-2">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Create your organization
          </h1>
          <p className="text-muted-foreground text-balance">
            Set up your workspace to start collaborating with your team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-foreground">
              Organization name
            </Label>
            <Input
              id="org-name"
              placeholder="Acme Inc."
              value={organizationName}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={organizationMutation.isPending}
              className="h-11"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              This is your organization&apos;s visible name within the app.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector" className="text-foreground">
              Sector
            </Label>
            <Select
              value={sector}
              onValueChange={setSector}
              disabled={organizationMutation.isPending}
            >
              <SelectTrigger id="sector" className="h-11">
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the sector your organization operates in.
            </p>
          </div>

          {/* Features list */}
          {/* <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              What you&apos;ll get:
            </p>
            <ul className="space-y-2">
              {[
                "Invite unlimited team members",
                "Collaborative workspace",
                "Centralized billing and settings",
                "Advanced team permissions",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={
              organizationMutation.isPending ||
              !organizationName.trim() ||
              !sector
            }
          >
            {organizationMutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating organization...
              </>
            ) : (
              <>
                Create organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          You can always change these settings later in your organization
          dashboard.
        </p>
      </div>
    </Card>
  );
}
