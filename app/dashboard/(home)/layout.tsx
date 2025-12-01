import type React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProtectedStoreInitializer } from "@/components/layout/ProtectedStoreInitializer";
import { WorkspaceLayout } from "@/components/dashboard/workspace_layout";

export default async function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <ProtectedStoreInitializer>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </ProtectedStoreInitializer>
  );
}
