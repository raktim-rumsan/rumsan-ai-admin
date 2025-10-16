import Link from "next/link";
import { Building2, Users, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OrganizationPage() {
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
                <Input id="org-name" defaultValue="Rumsan Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-domain">Domain</Label>
                <Input id="org-domain" defaultValue="rumsanbank.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-description">Description</Label>
                <Input
                  id="org-description"
                  defaultValue="Leading digital banking solutions"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Manage team members and their roles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Admin Users</p>
                    <p className="text-sm text-muted-foreground">5 members</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Viewer Users</p>
                    <p className="text-sm text-muted-foreground">23 members</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <Button className="w-full mt-4">Invite Team Member</Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure organization-wide settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Security Settings</p>
                    <p className="text-sm text-muted-foreground">
                      2FA, SSO, and access controls
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">API Keys</p>
                    <p className="text-sm text-muted-foreground">
                      Manage API access
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Keys
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
