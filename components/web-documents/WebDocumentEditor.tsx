"use client";

import React from "react";
import { RefreshCw, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { TooltipWrapper } from "../common/ToolTipProvider";

interface Section {
  id: string;
  title: string;
  content: string;
  isEditing: boolean;
}

interface CapturedContent {
  id: string;
  url: string;
  title: string;
  date: string;
  sections: Section[];
  enabled: boolean;
  isTraining?: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateSection: (sectionId: string, newContent: string) => void;
  toggleEditMode: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  handleSaveEdits: (shouldTrain?: boolean) => void;
  getMarkdownPreview: () => string;
  editingContent: CapturedContent | null;
  setEditingContent: (c: CapturedContent | null) => void;
  embeddingPending: boolean;
  unEmbeddingPending: boolean;
  onCancel?: () => void;
}

export default function WebDocumentEditor({
  open,
  onOpenChange,
  updateSection,
  toggleEditMode,
  removeSection,
  handleSaveEdits,
  getMarkdownPreview,
  editingContent,
  setEditingContent,
  embeddingPending,
  unEmbeddingPending,
  onCancel,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open && editingContent) {
          setEditingContent(null);
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingContent?.title || "Content Preview & Edit"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="cursor-pointer">
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" className="cursor-pointer">
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="prose prose-sm dark:prose-invert max-w-none space space-4 p-8 border border-border rounded-lg bg-card">
              <ReactMarkdown>{getMarkdownPreview()}</ReactMarkdown>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 mt-4">
            <div className="space-y-4">
              {editingContent?.sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {section.title && (
                        <h3 className="font-semibold text-lg mb-3">
                          {section.title}
                        </h3>
                      )}
                      {section.isEditing ? (
                        <Textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(section.id, e.target.value)
                          }
                          className="min-h-24"
                        />
                      ) : (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {section.content}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <TooltipWrapper
                        label={
                          section.isEditing ? "Done Editing" : "Edit Section"
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEditMode(section.id)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                      </TooltipWrapper>

                      <TooltipWrapper label="Delete Section">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipWrapper>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex items-center gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={() => {
                onCancel?.();
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveEdits(false)}
              disabled={embeddingPending || unEmbeddingPending}
              className="cursor-pointer"
            >
              Save
            </Button>
            <Button
              onClick={() => handleSaveEdits(true)}
              className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="size-4" />
              {embeddingPending ? "Training..." : "Save & Train"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
