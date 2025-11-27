"use client";
import React from "react";
import MembersTab from "@/components/workspace-management/members-tabs";

export default function TeamManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <MembersTab readOnly={true} />
    </div>
  );
}
