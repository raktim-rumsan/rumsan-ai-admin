"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronsUpDown, Check } from "lucide-react";
import { useKnowledgebaseQuery } from "@/queries/documentsQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { INDUSTRY_OPTIONS } from "@/constants/industry";
import { cn } from "@/lib/utils";
import KnowledgebaseStats from "./knowlege-stats";
import { Doc } from "@/types/workspace-types";
import { Skeleton } from "../ui/skeleton";

export default function KnowledgebaseTab() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const { data: fetchedDocs = [], isLoading, error } = useKnowledgebaseQuery(selectedIndustries) as {
    data: Doc[];
    isLoading: boolean;
    error: unknown;
  };


  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  if (isLoading) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Loading Knowledgebase</CardTitle>
        <CardDescription>Please wait while we fetch your documents...</CardDescription>
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
          Something went wrong while fetching your knowledgebase. Please try again later.
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[240px] justify-between"
                >
                  {selectedIndustries.length > 0
                    ? `${selectedIndustries.length} selected`
                    : "Select industries"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0">
                <Command>
                  <CommandGroup>
                    {INDUSTRY_OPTIONS.map(({ label, value }) => (
                      <CommandItem key={value} onSelect={() => toggleIndustry(value)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedIndustries.includes(value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
                      <Switch />
                      
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

