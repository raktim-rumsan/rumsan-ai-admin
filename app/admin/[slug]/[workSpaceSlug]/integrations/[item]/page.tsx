"use client";
import AdminDashboardHeader from "@/components/admin-dashboard/admin-dashboard-header";
import AdminIntegrations from "@/components/sections/integrations/admin-integratons";

export default function page() {
  return (
    <>
      <AdminDashboardHeader />
      <AdminIntegrations />
    </>
  );
}
