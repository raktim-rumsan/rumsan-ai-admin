import type React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProtectedStoreInitializer } from "@/components/layout/ProtectedStoreInitializer";
import { AdminHeader } from "@/components/admin-dashboard/header";
import { MainHeader } from "@/components/header/header";

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
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <MainHeader />
      </div>
      {children}
    </ProtectedStoreInitializer>
  );
}
