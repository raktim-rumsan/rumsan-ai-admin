"use client";

import { Plus, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Doc } from "@/types/workspace-types";
import KnowledgebaseStats from "./knowlege-stats";
import { useState } from "react";

interface Props {
  knowledgebase?: Doc[];
  setKnowledgebase?: (docs: Doc[]) => void;
}

export default function KnowledgebaseTab({
  knowledgebase: initialKnowledgebase,
  setKnowledgebase: externalSetKnowledgebase,
}: Props) {
  const [knowledgebase, setKnowledgebase] = useState<Doc[]>(
    initialKnowledgebase && initialKnowledgebase.length > 0
      ? initialKnowledgebase
      : [
          {
            id: "1",
            name: "Product Guide 2024",
            size: "2.4 MB",
            uploadedAt: "2024-01-15",
            enabled: true,
          },
          {
            id: "2",
            name: "Customer FAQ",
            size: "1.8 MB",
            uploadedAt: "2024-01-20",
            enabled: true,
          },
          {
            id: "3",
            name: "Banking Policies",
            size: "3.2 MB",
            uploadedAt: "2024-02-01",
            enabled: false,
          },
          {
            id: "4",
            name: "Compliance Guidelines",
            size: "4.1 MB",
            uploadedAt: "2024-02-10",
            enabled: true,
          },
          {
            id: "5",
            name: "Training Manual",
            size: "5.3 MB",
            uploadedAt: "2024-02-15",
            enabled: false,
          },
        ]
  );

  const toggleKnowledgebase = (id: string) => {
    const updatedDocs = knowledgebase.map((doc) =>
      doc.id === id ? { ...doc, enabled: !doc.enabled } : doc
    );
    setKnowledgebase(updatedDocs);
    externalSetKnowledgebase?.(updatedDocs);
  };

  const addDoc = () => {
    const newDoc: Doc = {
      id: (knowledgebase.length + 1).toString(),
      name: `New Document ${knowledgebase.length + 1}`,
      size: "1.0 MB",
      uploadedAt: new Date().toISOString().split("T")[0],
      enabled: true,
    };
    const updatedDocs = [newDoc, ...knowledgebase];
    setKnowledgebase(updatedDocs);
    externalSetKnowledgebase?.(updatedDocs);
  };

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
            <Button onClick={addDoc}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledgebase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {knowledgebase.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {doc.size}
                      </p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={doc.enabled}
                      onCheckedChange={() => toggleKnowledgebase(doc.id)}
                    />
                    <Label className="text-sm">
                      {doc.enabled ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {knowledgebase.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-1">
                Upload PDF documents to build your AI knowledgebase
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <KnowledgebaseStats knowledgebase={knowledgebase} />
    </div>
  );
}
