"use client";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { managementCardItem } from "./management-cards";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your RUMSAN AI platform
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {managementCardItem.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`group h-full transition-all relative ${
                  card.isAvailable
                    ? "hover:shadow-lg hover:border-primary/50 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (card.isAvailable) {
                    router.push(`/admin/${card.slug}`);
                  }
                }}
              >
                {!card.isAvailable && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/90 to-primary/70 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg bg-muted p-3 ${
                          card.isAvailable ? "group-hover:bg-primary/10" : ""
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            !card.isAvailable ? "opacity-50" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>

                        <p className="text-xs text-muted-foreground mt-1">
                          {card.stats}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className=" flex text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Create Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/workspaces"
                  className="text-sm text-primary hover:underline"
                >
                  + New Workspace
                </Link>
              </CardContent>
            </Card>

            <Card className="relative opacity-60 cursor-not-allowed">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Invite Team Member
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-muted-foreground pointer-events-none">
                  + Invite User
                </span>
              </CardContent>
            </Card>

            <Card className="relative opacity-60 cursor-not-allowed">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    View Analytics
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-muted-foreground pointer-events-none">
                  View Reports
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
