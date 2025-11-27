import Link from "next/link";
import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useOrganizationById,
  useOrganizationMutationUpdate,
} from "@/queries/organizationQuery";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { SECTORS } from "@/constants/sector";

export default function OrganizationPage() {
  const { data: organizationDataById, isLoading } = useOrganizationById();
  const updateOrganization = useOrganizationMutationUpdate();

  // Derive initial values directly from API data without useEffect
  const organizationData = organizationDataById?.data;
  const initialSector = organizationData?.sector || "";

  const [sector, setSector] = useState(initialSector);

  // Sync state when data changes (only when sector becomes available from API)
  const currentSector = sector || initialSector;

  const handleSave = () => {
    if (!currentSector) return;

    updateOrganization.mutate({
      name: organizationData?.name || "",
      sector: currentSector,
    });
  };

  const hasChanges = currentSector !== initialSector;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                Organization Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your organization settings and configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading organization details...
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Organization Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                      Basic information about your organization
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {organizationData?.name || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Organization name cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Industry Sector</Label>
                  <Select
                    value={currentSector}
                    onValueChange={setSector}
                    disabled={updateOrganization.isPending}
                  >
                    <SelectTrigger id="sector" className="h-12 w-full">
                      <SelectValue placeholder="Select your industry sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select the primary industry sector for your organization
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={
                      !hasChanges ||
                      updateOrganization.isPending ||
                      !currentSector
                    }
                  >
                    {updateOrganization.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                  {hasChanges && (
                    <Button
                      variant="outline"
                      onClick={() => setSector(initialSector)}
                      disabled={updateOrganization.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
