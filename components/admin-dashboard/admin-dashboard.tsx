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
import { useWorkspaceQuery } from "@/queries/workspaceQuery";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminDashboardHeader from "./admin-dashboard-header";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: workspaceData, isLoading: workspaceLoading } =
    useWorkspaceQuery();

  const workspaceCount = workspaceData?.data?.myWorkspaces.length || 0;

  const getCardStats = (card: any) => {
    if (card.slug === "workspaces") {
      if (workspaceLoading) return "Loading...";
      return `${workspaceCount} Active Workspace${
        workspaceCount !== 1 ? "s" : ""
      }`;
    }
    return card.stats;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminDashboardHeader />
      {!workspaceLoading && workspaceCount === 0 && (
        <div className="flex w-auto items-center justify-between gap-4 rounded-sm bg-zinc-900 px-6 py-4 mb-4 border border-zinc-800 mt-4 mr-4 ml-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-10 rounded-full bg-zinc-800 border border-zinc-700 shrink-0">
              <InfoIcon className="size-5 text-white" />
            </div>
            <p className="text-base font-medium text-white">
              Create your first workspace to get started
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white shrink-0"
            onClick={() => router.push("/admin/workspaces")}
          >
            Let&apos;s Start From Here
          </Button>
        </div>
      )}

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
                    <span className="inline-flex items-center rounded-full bg-linear-to-r from-primary/90 to-primary/70 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
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
                          {getCardStats(card)}
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

        {/* Quick Actions Section (moved to top) */}
        <div className="gap-6 my-2 md:grid-cols-2 lg:grid-cols-2">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
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
