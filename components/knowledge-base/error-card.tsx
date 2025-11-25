"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ErrorCardProps {
  message?: string;
}

export function ErrorCard({
  message = "Something went wrong.",
}: ErrorCardProps) {
  return (
    <Card className="p-6 border-red-300 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <FileText className="h-5 w-5 mr-2 text-red-500" />
          Failed to load documents
        </CardTitle>
        <CardDescription>
          Something went wrong while fetching the knowledgebase.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-red-500 font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}
