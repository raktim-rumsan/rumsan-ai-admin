"use client";

import { FileText } from "lucide-react";
import { useKnowledgebaseQuery } from "@/queries/documentsQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import KnowledgebaseStats from "@/components/workspace-management/knowlege-stats";
import { LoadingCard } from "./loading-card";
import { ErrorCard } from "./error-card";

export default function KnowledgeBaseDetail() {
  const { data: fetchedDocs, isLoading, error } = useKnowledgebaseQuery();

  const documents = fetchedDocs ?? [];

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorCard message={(error as Error).message} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Industry Knowledgebase</CardTitle>
              <CardDescription className="mt-2">
                Manage industry knowledge that the AI can reference.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doc.fileName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {doc.industry.charAt(0).toUpperCase() +
                            doc.industry.slice(1)}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Uploaded{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <KnowledgebaseStats knowledgebase={documents} />
    </div>
  );
}
