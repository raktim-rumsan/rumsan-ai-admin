"use client";
import React, { Suspense } from "react";
import MembersTab from "@/components/workspace-management/members-tabs";

function TeamManagementContent() {
  return (
    <div className="p-6 space-y-6">
      <MembersTab readOnly={true} />
    </div>
  );
}

export default function TeamManagementPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <TeamManagementContent />
    </Suspense>
  );
}
