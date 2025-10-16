"use client";
import { managementCardItem } from "@/components/admin-dashboard/management-cards";
import { notFound } from "next/navigation";
import React from "react";

export default function ManagementDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  const item = managementCardItem.find(
    (item) => item.slug === resolvedParams.slug
  );

  if (!item) return notFound();

  return (
    <div className="p-4 w-full max-w-full space-y-6 overflow-hidden">
      {item.component}
    </div>
  );
}
