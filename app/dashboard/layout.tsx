import type React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProtectedStoreInitializer } from "@/components/layout/ProtectedStoreInitializer";
import FloatingPreviewChat from "@/components/sections/agent-preview/floating-chat";
import ChatbotPreview from "@/components/chatbot-preview/chatbot-preview";

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
      <DashboardLayout>
        {children}
        {/* <FloatingPreviewChat /> */}
      </DashboardLayout>
    </ProtectedStoreInitializer>
  );
}
