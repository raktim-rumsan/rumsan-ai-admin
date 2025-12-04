"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

export function KnowledgebaseLoading() {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Loading Knowledgebase</CardTitle>
        <CardDescription>
          Please wait while we fetch the knowledgebase documents...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {[1, 2, 3].map((_, i) => (
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

export function KnowledgebaseError({ error }: { error: unknown }) {
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
