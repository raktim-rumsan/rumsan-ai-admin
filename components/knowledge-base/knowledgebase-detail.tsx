"use client";

import { useKnowledgebaseQuery } from "@/queries/documentsQuery";
import { LoadingCard } from "./loading-card";
import KnowledgebaseData from "./knowledgebase-data";

export default function KnowledgeBaseDetail() {
  const { data: fetchedDocs, isLoading, error } = useKnowledgebaseQuery();

  const documents = fetchedDocs ?? [];

  return isLoading ? (
    <LoadingCard />
  ) : (
    <KnowledgebaseData data={documents} error={error} />
  );
}
