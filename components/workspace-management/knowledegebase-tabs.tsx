"use client";

import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { useKnowledgebaseQuery, useToggleDocumentStatusMutation } from "@/queries/documentsQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toastUtils } from "@/lib/toast-utils";

import KnowledgebaseStats from "./knowlege-stats";
import { Doc } from "@/types/workspace-types";
import { Skeleton } from "../ui/skeleton";

export default function KnowledgebaseTab() {
  const { data: fetchedDocs = [], isLoading, error } = useKnowledgebaseQuery() as {
    data: Doc[];
    isLoading: boolean;
    error: unknown;
  };

  const toggleMutation = useToggleDocumentStatusMutation();
  const handleToggle = (documentId: string) => {
  toggleMutation.mutate(documentId);
};

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Loading Knowledgebase</CardTitle>
          <CardDescription>Please wait while we fetch the knowledgebase documents...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[60%]" />
              </div>
            </div>
          ))} 
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <FileText className="h-5 w-5 mr-2 text-red-500" />
            Failed to load documents
          </CardTitle>
          <CardDescription>
            Something went wrong while fetching the knowledgebase. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500 font-medium">
            {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
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
            {fetchedDocs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              fetchedDocs.map((doc) => (
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
                          {doc.industry.charAt(0).toUpperCase() + doc.industry.slice(1)}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                    <Switch
                        checked={doc.enabled}
                        onCheckedChange={() => handleToggle(doc.id)}
                      />
                       <span
                          className={`text-sm font-medium ${
                            doc.enabled ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {doc.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <KnowledgebaseStats knowledgebase={fetchedDocs} />
    </div>
  );
}

