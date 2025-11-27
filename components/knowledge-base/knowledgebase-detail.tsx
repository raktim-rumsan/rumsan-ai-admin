"use client";

import { useKnowledgebaseQuery } from "@/queries/documentsQuery";
import { LoadingCard } from "./loading-card";
import KnowledgebaseData from "./knowledgebase-data";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

export default function KnowledgeBaseDetail() {
  const { workspaces, isLoading: orgLoading } = useOrganizationContext();
  const sector = workspaces?.[0]?.sector;

  const {
    data: fetchedDocs,
    isLoading,
    error,
  } = useKnowledgebaseQuery(sector!);

  return isLoading || orgLoading ? (
    <LoadingCard />
  ) : (
    <KnowledgebaseData data={fetchedDocs ?? []} error={error} />
  );
}
