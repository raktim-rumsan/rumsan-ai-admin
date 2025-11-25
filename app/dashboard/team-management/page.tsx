"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceMemberQuery, useWorkspaceQuery } from "@/queries/workspaceQuery";

export default function TeamManagementPage() {
  const selectedSlug =
    typeof window !== "undefined" ? localStorage.getItem("workspaceId") : null;

  const { data: workspaceData } = useWorkspaceQuery();
  const accessible = workspaceData?.data?.myWorkspaces || [];

  const currentWorkspace = useMemo(() => {
    return accessible.find((w) => w.slug === selectedSlug);
  }, [accessible, selectedSlug]);

  const workspaceId = currentWorkspace?.id;

  const {
    data: workspaceMembers,
    isLoading,
    error,
  } = useWorkspaceMemberQuery(workspaceId || "");

  const members = workspaceMembers?.data?.members || [];

  return (
   <div className="p-6 space-y-6">
     <div className="flex items-center justify-between">
       <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Team Management</h1>
        <p className="text-sm text-muted-foreground">
          List of members in this workspace.
        </p>
      </div>
      </div>
      <Card className="w-full max-w-2xl">
        <CardContent>
           <div className="mt-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading members...</p>}

          {error && <p className="text-sm text-destructive">{error.message}</p>}

          {!isLoading && !error && members.length === 0 && (
            <p className="text-sm text-muted-foreground">No members found.</p>
          )}

          {members.length > 0 && (
            <div className="grid gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg border bg-card flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{m.user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{m.user.email}</p>
                  </div>

                  <Badge variant="outline">{m.role}</Badge>
                </div>
              ))}
            </div>
          )}
          </div>
        </CardContent> 
      </Card>
    </div>
  );
}

