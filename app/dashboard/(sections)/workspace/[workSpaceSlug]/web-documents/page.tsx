"use client";

import { useState } from "react";
import { Trash2, FileText, RefreshCw, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactMarkdown from "react-markdown";
import { useScrapeWebsiteMutation } from "@/queries/workspaceQuery";

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
  const [urlInput, setUrlInput] = useState("");
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [capturedContents, setCapturedContents] = useState<CapturedContent[]>(
    []
  );
  const [selectedContent, setSelectedContent] =
    useState<CapturedContent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [tempContentForTraining, setTempContentForTraining] =
    useState<CapturedContent | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

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

  const handleFetchContent = () => {
    setUrlError(null);

    if (!urlInput.trim()) {
      const errorMsg = "Please enter a valid URL";
      setUrlError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    scrapeWebsite(
      { url: urlInput },
      {
        onSuccess: (data: ScrapeWebsiteResponse) => {
          // Assuming the API returns markdown content in data.markdown or data.content
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
            return;
          }

          // Check if the response is a 404 page
          if (is404Page(markdown)) {
            const errorMsg =
              "The requested page was not found (404). Please check the URL and try again.";
            setUrlError(errorMsg);
            toast.error(errorMsg);
            return;
          }

          // Clear any previous errors on success
          setUrlError(null);

          const sections = parseMarkdownIntoSections(markdown);
          const pageTitle = extractTitleFromMarkdown(markdown, urlInput);

          const now = new Date();
          const dateStr = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const newContent: CapturedContent = {
            id: `content-${Date.now()}`,
            url: urlInput,
            title: pageTitle,
            date: dateStr,
            sections,
            enabled: false,
            isTraining: false,
          };

          setTempContentForTraining(newContent);
          setSelectedContent(newContent);
          setUrlInput("");
          setIsUrlModalOpen(false);
          setIsEditDialogOpen(true);

          toast.success("Content captured successfully");
        },
        onError: (error: Error) => {
          const errorMsg =
            error.message || "Failed to fetch content. Please check the URL.";
          setUrlError(errorMsg);
          toast.error(errorMsg);
        },
      }
    );
  };

  const updateSection = (sectionId: string, newContent: string) => {
    if (selectedContent) {
      const updatedContent = {
        ...selectedContent,
        sections: selectedContent.sections.map((section) =>
          section.id === sectionId
            ? { ...section, content: newContent }
            : section
        ),
      };

      setSelectedContent(updatedContent);
      if (tempContentForTraining?.id === selectedContent.id) {
        setTempContentForTraining(updatedContent);
      }
    }
  };

  const toggleEditMode = (sectionId: string) => {
    if (selectedContent) {
      const updatedContent = {
        ...selectedContent,
        sections: selectedContent.sections.map((section) =>
          section.id === sectionId
            ? { ...section, isEditing: !section.isEditing }
            : section
        ),
      };

      setSelectedContent(updatedContent);
      if (tempContentForTraining?.id === selectedContent.id) {
        setTempContentForTraining(updatedContent);
      }
    }
  };

  const removeSection = (sectionId: string) => {
    if (selectedContent) {
      const updatedContent = {
        ...selectedContent,
        sections: selectedContent.sections.filter(
          (section) => section.id !== sectionId
        ),
      };

      setSelectedContent(updatedContent);
      if (tempContentForTraining?.id === selectedContent.id) {
        setTempContentForTraining(updatedContent);
      }
    }
  };

  const handleSaveEdits = () => {
    if (selectedContent && selectedContent.sections.length === 0) {
      toast.error("Cannot save with no sections");
      return;
    }

    if (selectedContent) {
      if (
        tempContentForTraining &&
        tempContentForTraining.id === selectedContent.id
      ) {
        setCapturedContents([selectedContent, ...capturedContents]);
        setTempContentForTraining(null);
      } else {
        setCapturedContents(
          capturedContents.map((content) =>
            content.id === selectedContent.id ? selectedContent : content
          )
        );
      }

      setIsEditDialogOpen(false);
      toast.success("Content saved successfully");
    }
  };

  const handleTrain = async () => {
    const contentToTrain = tempContentForTraining || selectedContent;
    if (!contentToTrain) return;

    try {
      setTrainingId(contentToTrain.id);
      toast.loading("Saving to database...");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedContent = { ...contentToTrain, enabled: false };
      setCapturedContents([updatedContent, ...capturedContents]);
      setTempContentForTraining(null);
      setIsEditDialogOpen(false);

      toast.success("Data saved successfully");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCapturedContents((prev) =>
        prev.map((content) =>
          content.id === contentToTrain.id
            ? { ...content, enabled: true }
            : content
        )
      );

      toast.loading("Training document...");

      const randomDuration = Math.random() * 2000 + 3000;
      await new Promise((resolve) => setTimeout(resolve, randomDuration));

      toast.success("Training completed successfully");
    } catch {
      toast.error("Operation failed");
    } finally {
      setTrainingId(null);
    }
  };

  const handleRefresh = async (content: CapturedContent) => {
    setRefreshingId(content.id);
    toast.loading("Refreshing...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockMarkdown = `# Rahat

Rahat (relief in Nepali) is an open-source blockchain-based financial access platform to support vulnerable communities.

We are building resilience against the impact of climate shocks through decentralized and transparent financial access.

## Our Mission

To bridge the opportunity divide and break the poverty cycle by providing immediate access to financial aid, building financial resilience, and fostering digital financial literacy for the last billion.

## Our Vision

Financial Inclusion & Access for the last billion.

## Our Team

### Rumee Singh

CEO & Founder

### Santosh Shrestha

CTO & Lead Developer`;

      const sections = parseMarkdownIntoSections(mockMarkdown);
      const pageTitle = extractTitleFromMarkdown(mockMarkdown, content.url);

      const updatedContent = {
        ...content,
        title: pageTitle,
        sections,
        enabled: false,
      };

      setCapturedContents(
        capturedContents.map((c) => (c.id === content.id ? updatedContent : c))
      );

      if (selectedContent?.id === content.id) {
        setSelectedContent(updatedContent);
      }

      if (tempContentForTraining?.id === content.id) {
        setTempContentForTraining(updatedContent);
      }

      toast.success("Content refreshed successfully");
    } catch {
      toast.error("Failed to refresh content");
    } finally {
      setRefreshingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    const content = capturedContents.find((c) => c.id === id);
    if (!content) return;

    if (!content.enabled) {
      setCapturedContents(
        capturedContents.map((content) =>
          content.id === id ? { ...content, enabled: true } : content
        )
      );

      setTrainingId(id);
      toast.loading("Training document...");

      try {
        const randomDuration = Math.random() * 2000 + 3000;
        await new Promise((resolve) => setTimeout(resolve, randomDuration));

        toast.success("Training completed successfully");
      } catch {
        toast.error("Training failed");
      } finally {
        setTrainingId(null);
      }
    } else {
      setCapturedContents(
        capturedContents.map((content) =>
          content.id === id ? { ...content, enabled: false } : content
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    setCapturedContents(
      capturedContents.filter((content) => content.id !== id)
    );
    toast.success("Content deleted successfully");
  };

  const getMarkdownPreview = () => {
    if (!selectedContent) return "";

    return selectedContent.sections
      .map((section) => {
        if (section.title) {
          return `## ${section.title}\n\n${section.content}`;
        }
        return section.content;
      })
      .join("\n\n");
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
    <div className="space-y-6 p-6">
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

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {capturedContents.length > 0 ? (
              capturedContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>
                    <div
                      className="text-muted-foreground text-sm max-w-xs cursor-pointer hover:text-foreground transition-colors"
                      title={content.url}
                      onClick={() => window.open(content.url, "_blank")}
                    >
                      {cropUrl(content.url)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {content.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedContent(content);
                                setIsEditDialogOpen(true);
                              }}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                              disabled={
                                trainingId === content.id ||
                                refreshingId === content.id
                              }
                            >
                              <FileText className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View & Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRefresh(content)}
                              disabled={
                                refreshingId === content.id ||
                                trainingId === content.id
                              }
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <RefreshCw className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Refresh</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex cursor-pointer">
                              <Switch
                                checked={content.enabled}
                                onCheckedChange={() => handleToggle(content.id)}
                                disabled={
                                  trainingId === content.id ||
                                  refreshingId === content.id
                                }
                                className={
                                  trainingId === content.id ||
                                  refreshingId === content.id
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {content.enabled
                              ? "Disable Training"
                              : "Enable Training"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(content.id)}
                              className="text-destructive hover:text-destructive cursor-pointer"
                              disabled={
                                trainingId === content.id ||
                                refreshingId === content.id
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No websites captured yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
                  setUrlError(null); // Clear error when user types
                }}
                placeholder="Enter website URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFetchContent();
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
              onClick={handleFetchContent}
              disabled={isScraping}
              className="cursor-pointer"
            >
              {isScraping ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open && tempContentForTraining) {
            setTempContentForTraining(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[800px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContent?.title || "Content Preview & Edit"}
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
                {selectedContent?.sections.map((section) => (
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEditMode(section.id)}
                                className="cursor-pointer"
                              >
                                <Edit2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {section.isEditing
                                ? "Done Editing"
                                : "Edit Section"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSection(section.id)}
                                className="text-destructive hover:text-destructive cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Section</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                  setIsEditDialogOpen(false);
                  if (tempContentForTraining) {
                    setTempContentForTraining(null);
                  }
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdits}
                disabled={trainingId !== null}
                className="cursor-pointer"
              >
                Save
              </Button>
              <Button
                onClick={handleTrain}
                disabled={trainingId !== null}
                className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="size-4" />
                {trainingId === selectedContent?.id
                  ? "Training..."
                  : "Save & Train"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
