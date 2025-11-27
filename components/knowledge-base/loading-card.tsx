"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
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
