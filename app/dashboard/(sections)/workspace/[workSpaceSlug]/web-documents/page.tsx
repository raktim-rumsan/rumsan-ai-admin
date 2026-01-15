"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useScrapeWebsiteMutation } from "@/queries/workspaceQuery";
import {
  useCreateWebDocumentMutation,
  useUpdateWebDocumentMutation,
  useWebDocDeleteMutation,
  useWebDocEmbeddingMutation,
  useWebDocumentsQuery,
  useWebDocUnembeddingMutation,
} from "@/queries/webDocuments";
import { useParams } from "next/navigation";
import ConfirmDelete from "@/components/documents/DeleteModal";
import WebDocumentEditor from "@/components/web-documents/WebDocumentEditor";
import WebDocumentsTable from "@/components/web-documents/WebDocumentsTable";

interface CapturedContent {
  id: string;
  url: string;
  title: string;
  date: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    isEditing: boolean;
  }>;
  enabled: boolean;
  isTraining?: boolean;
  status?: string;
}

interface ScrapeWebsiteResponse {
  markdown?: string;
  content?: string;
  data?: {
    markdown?: string;
    content?: string;
  };
}

export default function WebDocumentsPage() {
  const { workSpaceSlug } = useParams();

  const [urlInput, setUrlInput] = useState("");
  const [editingContent, setEditingContent] = useState<CapturedContent | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentDeleteInfo, setCurrentDeleteInfo] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const { data: response } = useWebDocumentsQuery(workSpaceSlug as string);
  const webDocuments = response?.data;
  const createWebDocumentMutation = useCreateWebDocumentMutation(
    workSpaceSlug as string
  );
  const updateWebDocumentMutation = useUpdateWebDocumentMutation(
    workSpaceSlug as string
  );
  const deleteMutation = useWebDocDeleteMutation(workSpaceSlug as string);
  const embeddingMutation = useWebDocEmbeddingMutation(workSpaceSlug as string);
  const unEmbeddingMutation = useWebDocUnembeddingMutation(
    workSpaceSlug as string
  );
  const { mutate: scrapeWebsite, isPending: isScraping } =
    useScrapeWebsiteMutation();

  const parseMarkdownIntoSections = (markdown: string) => {
    const lines = markdown.split("\n");
    const sections: CapturedContent["sections"] = [];
    let currentSection = { title: "", content: "" };

    lines.forEach((line) => {
      if (line.match(/^#+\s/)) {
        if (currentSection.title || currentSection.content) {
          sections.push({
            id: `section-${Date.now()}-${Math.random()}`,
            title: currentSection.title,
            content: currentSection.content.trim(),
            isEditing: false,
          });
        }
        currentSection = { title: line.replace(/^#+\s/, ""), content: "" };
      } else if (line.trim()) {
        currentSection.content += (currentSection.content ? "\n" : "") + line;
      }
    });

    if (currentSection.title || currentSection.content) {
      sections.push({
        id: `section-${Date.now()}-${Math.random()}`,
        title: currentSection.title,
        content: currentSection.content.trim(),
        isEditing: false,
      });
    }

    return sections;
  };

  const serializeSectionsToMarkdown = (
    sections: CapturedContent["sections"]
  ) => {
    return sections
      .map((section) =>
        section.title
          ? `## ${section.title}\n${section.content}`
          : section.content
      )
      .join("\n\n");
  };

  const extractTitleFromMarkdown = (markdown: string, url: string): string => {
    const lines = markdown.split("\n");
    for (const line of lines) {
      const headingMatch = line.match(/^#+\s(.+)$/);
      if (headingMatch) {
        return headingMatch[1].trim();
      }
    }
    return new URL(url).hostname;
  };

  const handleLoadContentForEdit = (doc: {
    id: string;
    url: string;
    content: string;
    createdAt: string;
    status?: string | boolean;
  }) => {
    const sections = parseMarkdownIntoSections(doc.content);
    const pageTitle = extractTitleFromMarkdown(doc.content, doc.url);

    const contentForUI: CapturedContent = {
      id: doc.id,
      url: doc.url,
      title: pageTitle,
      date: new Date(doc.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      sections,
      enabled: !!doc.status,
      status:
        typeof doc.status === "string"
          ? doc.status
          : doc.status
          ? "PROCESSED"
          : "PENDING",
    };

    setEditingContent(contentForUI);
    setIsEditDialogOpen(true);
  };

  const is404Page = (markdown: string): boolean => {
    const lowerMarkdown = markdown.toLowerCase();
    const indicators = [
      "404",
      "page not found",
      "not found",
      "page you are looking for",
      "not available",
    ];
    return indicators.some((indicator) => lowerMarkdown.includes(indicator));
  };

  // Generic helper for updating sections
  const updateSections = (
    transform: (
      sections: CapturedContent["sections"]
    ) => CapturedContent["sections"]
  ) => {
    if (!editingContent) return;
    setEditingContent({
      ...editingContent,
      sections: transform(editingContent.sections),
    });
  };

  // Update content of a section
  const updateSection = (id: string, content: string) =>
    updateSections((sections) =>
      sections.map((s) => (s.id === id ? { ...s, content } : s))
    );

  // Toggle edit mode
  const toggleEditMode = (id: string) =>
    updateSections((sections) =>
      sections.map((s) => (s.id === id ? { ...s, isEditing: !s.isEditing } : s))
    );

  // Remove a section
  const removeSection = (id: string) =>
    updateSections((sections) => sections.filter((s) => s.id !== id));

  const handleSaveEdits = (shouldTrain: boolean = false) => {
    if (!editingContent) return;

    if (editingContent.sections.length === 0) {
      toast.error("Cannot save content with no sections");
      return;
    }

    const mergedMarkdown = serializeSectionsToMarkdown(editingContent.sections);

    let documentId: string;

    if (editingContent.id) {
      // UPDATE
      updateWebDocumentMutation.mutate(
        {
          id: editingContent.id,
          body: { url: editingContent.url, content: mergedMarkdown },
        },
        {
          onSuccess: (res: any) => {
            documentId = editingContent.id;
            if (shouldTrain) {
              handleEmbedding(documentId, true);
            } else if (editingContent.status === "PROCESSED") {
              handleEmbedding(documentId, false);
            }
            setIsEditDialogOpen(false);
          },
        }
      );
    } else {
      // CREATE
      createWebDocumentMutation.mutate(
        { url: editingContent.url, content: mergedMarkdown },
        {
          onSuccess: (res: any) => {
            documentId = res.data.id;

            if (shouldTrain) {
              embeddingMutation.mutate(documentId);
            }

            setIsEditDialogOpen(false);
          },
        }
      );
    }
  };

  const fetchOrRefreshContent = (
    url: string,
    existingContent?: CapturedContent
  ) => {
    setUrlError(null);

    if (!url.trim()) {
      const errorMsg = "Please enter a valid URL";
      setUrlError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const loadingToastId = toast.loading(
      existingContent ? "Refreshing..." : "Capturing content..."
    );

    scrapeWebsite(
      { url },
      {
        onSuccess: (data: ScrapeWebsiteResponse) => {
          const markdown =
            data?.markdown ||
            data?.content ||
            data?.data?.markdown ||
            data?.data?.content ||
            "";

          if (!markdown) {
            const errorMsg = "No content found in the response";
            setUrlError(errorMsg);
            toast.error(errorMsg);
            toast.dismiss(loadingToastId);
            return;
          }

          if (is404Page(markdown)) {
            const errorMsg =
              "The requested page was not found (404). Please check the URL and try again.";
            setUrlError(errorMsg);
            toast.error(errorMsg);
            toast.dismiss(loadingToastId);
            return;
          }

          const sections = parseMarkdownIntoSections(markdown);
          const pageTitle = extractTitleFromMarkdown(markdown, url);

          const now = new Date();
          const dateStr = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          let newContent: CapturedContent;

          if (existingContent) {
            // Refreshing existing content
            newContent = {
              ...existingContent,
              title: pageTitle,
              sections,
              enabled: false,
            };
          } else {
            // New content capture
            newContent = {
              id: undefined as unknown as string,
              url,
              title: pageTitle,
              date: dateStr,
              sections,
              enabled: false,
              isTraining: false,
            };
          }

          setEditingContent(newContent);

          setIsEditDialogOpen(true);
          if (!existingContent) setIsUrlModalOpen(false);
          if (!existingContent) setUrlInput("");

          toast.success(
            existingContent
              ? "Content refreshed successfully"
              : "Content captured successfully"
          );
          toast.dismiss(loadingToastId);
        },
        onError: (error: Error) => {
          const errorMsg =
            error.message ||
            (existingContent
              ? "Failed to refresh content"
              : "Failed to fetch content. Please check the URL.");
          setUrlError(errorMsg);
          toast.error(errorMsg);
          toast.dismiss(loadingToastId);
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (!currentDeleteInfo) return;

    deleteMutation.mutate(currentDeleteInfo.id, {
      onSettled: () => {
        setOpenDeleteModal(false);
        setCurrentDeleteInfo(null);
      },
    });
  };

  const getMarkdownPreview = () =>
    editingContent ? serializeSectionsToMarkdown(editingContent.sections) : "";

  const handleEmbedding = (webDocumentId: string, isEnabled: boolean) => {
    const mutation = isEnabled ? embeddingMutation : unEmbeddingMutation;

    mutation.mutate(webDocumentId);
  };

  const cropUrl = (url: string) => {
    const maxChars = 25;
    if (url.length <= maxChars) return url;

    const charsPerSide = Math.floor((maxChars - 4) / 2);
    const start = url.substring(0, charsPerSide);
    const end = url.substring(url.length - charsPerSide);

    return `${start}....${end}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Web Content Capture</h1>
          <p className="text-muted-foreground text-sm">
            Scrape and manage web content as markdown for knowledge base
          </p>
        </div>
        <Button
          onClick={() => setIsUrlModalOpen(true)}
          className="gap-2 cursor-pointer"
        >
          + Add Website
        </Button>
      </div>

      <WebDocumentsTable
        webDocuments={webDocuments}
        formatDate={formatDate}
        cropUrl={cropUrl}
        handleLoadContentForEdit={handleLoadContentForEdit}
        fetchOrRefreshContent={fetchOrRefreshContent}
        handleEmbedding={handleEmbedding}
        onDeleteClick={(doc) => {
          setCurrentDeleteInfo({ id: doc.id, url: doc.url });
          setOpenDeleteModal(true);
        }}
        embeddingPending={embeddingMutation.isPending}
        unEmbeddingPending={unEmbeddingMutation.isPending}
        deletePending={deleteMutation.isPending}
      />

      <Dialog open={isUrlModalOpen} onOpenChange={setIsUrlModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Website</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                placeholder="Enter website URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchOrRefreshContent(urlInput);
                  }
                }}
                className={urlError ? "border-destructive" : ""}
              />
              {urlError && (
                <p className="text-sm text-destructive">{urlError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUrlModalOpen(false);
                setUrlInput("");
                setUrlError(null);
              }}
              disabled={isScraping}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => fetchOrRefreshContent(urlInput)}
              disabled={isScraping}
              className="cursor-pointer"
            >
              {isScraping ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WebDocumentEditor
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open && editingContent) {
            setEditingContent(null);
          }
        }}
        updateSection={updateSection}
        toggleEditMode={toggleEditMode}
        removeSection={removeSection}
        handleSaveEdits={handleSaveEdits}
        getMarkdownPreview={getMarkdownPreview}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        embeddingPending={embeddingMutation.isPending}
        unEmbeddingPending={unEmbeddingMutation.isPending}
        onCancel={() => {
          setIsEditDialogOpen(false);
          if (editingContent) {
            setEditingContent(null);
          }
        }}
      />
      <ConfirmDelete
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        item={currentDeleteInfo?.url || ""}
      />
    </div>
  );
}
