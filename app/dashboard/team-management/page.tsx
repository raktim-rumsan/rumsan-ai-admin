"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceMemberQuery, useWorkspaceQuery } from "@/queries/workspaceQuery";
import MembersTab from "@/components/workspace-management/members-tabs";

export default function TeamManagementPage() {

  return (
 <div className="p-6 space-y-6">
      <MembersTab readOnly={true} />
  </div>)
}

