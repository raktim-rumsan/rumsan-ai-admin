"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Plus,
  ChevronDown,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CircleGauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AvailableDocument } from "@/lib/customize-bank-data";
import { dismissToast, toastUtils } from "@/lib/toast-utils";
import {
  useDocUploadMutation,
  useEmbeddingMutation,
  useUnembeddingMutation,
} from "@/queries/demoSiteQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomizationPanelProps {
  bankName: string;
  assistantName: string;
  tagline: string;
  primaryColor: string;
  quickQuestions: string[];
  onNameChange: (name: string) => void;
  onAssistantNameChange: (name: string) => void;
  onTaglineChange: (tagline: string) => void;
  onColorChange: (color: string) => void;
  onLogoChange: (url: string | null) => void;
  onQuickQuestionsChange: (questions: string[]) => void;
  onPdfUpload: (file: File | null) => void;
  uploadedPdf: File | null;
  logoUrl: string | null;
  onSave?: () => void;
  onReset?: () => void;
  availableDocuments?: AvailableDocument[];
  enabledDocuments?: string[];
  onToggleDocument?: (docId: string) => void;
  selectedBotIcon?: string;
  onBotIconChange?: (icon: string) => void;
  uploadedPdfs?: File[];
  onRemovePdf?: (index: number) => void;
  enabledPdfs?: boolean[];
  onTogglePdf?: (index: number) => void;
  workspaceSlug?: string;
  bankCode?: string;
}

export function CustomizationPanel({
  bankName,
  assistantName,
  tagline,
  primaryColor,
  quickQuestions,
  onNameChange,
  onAssistantNameChange,
  onTaglineChange,
  onColorChange,
  onLogoChange,
  onQuickQuestionsChange,
  onPdfUpload,
  uploadedPdf,
  logoUrl,
  onSave,
  onReset,
  availableDocuments = [],
  enabledDocuments = [],
  onToggleDocument,
  selectedBotIcon = "🤖",
  onBotIconChange,
  uploadedPdfs = [],
  onRemovePdf,
  enabledPdfs = [],
  onTogglePdf,
  workspaceSlug,
  bankCode,
}: CustomizationPanelProps) {
  console.log(bankCode, "bankcode");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvailableDocsExpanded, setIsAvailableDocsExpanded] = useState(false);
  const [uploadedPdfEnabled, setUploadedPdfEnabled] = useState(true);
  const [trainingDocumentId, setTrainingDocumentId] = useState<string | null>(
    null,
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const embeddingMutation = useEmbeddingMutation(
    workspaceSlug as string,
    bankCode,
  );

  const unEmbeddingMutation = useUnembeddingMutation(
    workspaceSlug as string,
    bankCode,
  );

  const handleRemoveUploadedPdf = () => {
    onPdfUpload?.(null);
    setUploadedPdfEnabled(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTrain = async (
    documentId: string,
    fileName: string,
    isRetrain: boolean,
  ) => {
    const action = isRetrain ? "Retraining" : "Training";
    const loadingToastId = toastUtils.generic.loading(
      `${action} document. Please wait a moment.`,
    );

    // Set the training document ID to show loading state for this specific document
    setTrainingDocumentId(documentId);

    const mutation = isRetrain ? unEmbeddingMutation : embeddingMutation;

    mutation.mutate(documentId, {
      onError: (error: unknown) => {
        dismissToast(loadingToastId);
        setTrainingDocumentId(null); // Clear training state

        let errorMessage = `Failed to ${action.toLowerCase()} "${fileName}".`;
        let errorTitle = `${action} failed`;

        if (error instanceof Error) {
          errorMessage = error.message;

          // Check for specific error types to provide better user guidance
          if (error.message.includes("Failed to parse PDF")) {
            errorTitle = "Document Processing Error";
            errorMessage =
              "The PDF file appears to be corrupted or invalid. Please try uploading a different file.";
          } else if (
            error.message.includes("invalid top-level pages dictionary")
          ) {
            errorTitle = "PDF Format Error";
            errorMessage =
              "This PDF file has an invalid format and cannot be processed. Please try a different PDF file.";
          }
        }

        toastUtils.generic.error(errorTitle, errorMessage);
      },
      onSuccess: () => {
        dismissToast(loadingToastId);
        setTrainingDocumentId(null); // Clear training state
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Reset previous errors
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    // Allowed files
    const allowedTypes = ["application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid file type. Only PDF files are allowed.");
      return;
    }

    // Validate size
    if (file.size > maxSize) {
      setFileError("File size exceeds 10 MB.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };
  const uploadMutation = useDocUploadMutation(workspaceSlug, bankCode, () => {
    toastUtils.fileUpload.success(selectedFile?.name || "File");
    setSelectedFile(null);
    setIsUploading(false);
  });

  const handleUpload = () => {
    if (!selectedFile) {
      toastUtils.generic.error(
        "No file selected",
        "Please select a file to upload",
      );
      return;
    }

    setIsUploading(true);

    // Show upload started toast
    toastUtils.fileUpload.started(selectedFile.name);

    uploadMutation.mutate(selectedFile, {
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toastUtils.fileUpload.error(errorMessage);
        setIsUploading(false);
      },
      onSuccess: () => {
        setIsUploadModalOpen(false);
        // Success is handled in the mutation callback above
      },
    });
  };
  return (
    <div className="flex flex-col h-full bg-muted/30 overflow-hidden">
      {/* Header */}
      {/* <div className="px-4 py-4 border-b bg-background/40">
        <h3 className="font-semibold text-base text-foreground">Customization</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure the assistant appearance</p>
      </div> */}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Knowledge Base Section */}
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            {/* <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 text-xs font-semibold">1</span> */}
            Knowledge Base
          </h4>

          {/* Documents List */}
          <div className="space-y-2">
            {availableDocuments.map((doc) => {
              const isEnabled = enabledDocuments.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded border transition-colors",
                    isEnabled
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40"
                      : "bg-muted/5 border-border/40",
                  )}
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {doc.fileName}
                    </p>
                  </div>
                  <Switch
                    checked={doc.status !== "PENDING"}
                    onCheckedChange={(checked) =>
                      handleTrain(doc.id, doc.fileName || "", !checked)
                    }
                    disabled={trainingDocumentId === doc.id}
                    className="mt-0"
                  />
                </div>
              );
            })}

            {/* Uploaded PDF row (replaces Add Document when a file is uploaded) */}
            {uploadedPdf ? (
              <div
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded border transition-colors",
                  uploadedPdfEnabled
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40"
                    : "bg-muted/5 border-border/40",
                )}
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {uploadedPdf.name}
                  </p>
                </div>
                <Switch
                  checked={uploadedPdfEnabled}
                  onCheckedChange={setUploadedPdfEnabled}
                  className="mt-0"
                />
                <button
                  type="button"
                  onClick={handleRemoveUploadedPdf}
                  className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete uploaded document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Add Document Card */}
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center gap-2 p-2.5 rounded border border-dashed border-border/60 bg-muted/5 hover:bg-muted/10 hover:border-blue-400 transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-xs font-medium text-popover-foreground text-left">
                    Add Document
                  </span>
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onPdfUpload?.(file);
                    }
                  }}
                />
              </>
            )}

            <p className="text-xs text-muted-foreground leading-snug px-1">
              {uploadedPdf
                ? "Uploaded PDF. Delete to add another."
                : "Upload a PDF (only 1 file allowed)"}
            </p>
          </div>
        </section>
        {/* file upload modal   */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Upload File
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Select a file from your computer to upload.
              </p>
              <div className="space-y-2">
                <Label htmlFor="file-upload">File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className={
                    fileError ? "border-red-600 focus:ring-red-600" : ""
                  }
                />

                {fileError && (
                  <Alert className="border-red-200 bg-red-50 mt-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {fileError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  File size shouldn&apos;t exceed 10 MB.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Branding Section */}
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            {/* <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 text-xs font-semibold">2</span> */}
            Branding
          </h4>

          <div className="space-y-3">
            <div>
              <Label htmlFor="assistant-name" className="text-xs font-medium">
                Bot Name
              </Label>
              <Input
                id="assistant-name"
                value={assistantName}
                onChange={(e) => onAssistantNameChange(e.target.value)}
                className="mt-1 text-sm"
                placeholder="e.g., John, Banking Assistant"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This appears in the greeting message
              </p>
            </div>

            {/* <div>
              <Label htmlFor="tagline" className="text-sm">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => onTaglineChange(e.target.value)}
                className="mt-1.5"
                placeholder="Enter tagline"
              />
            </div> */}

            {/* <div>
              <Label className="text-sm block mb-2">Bot Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {botIcons.map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => onBotIconChange?.(icon.icon)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                      selectedBotIcon === icon.icon
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    title={icon.name}
                  >
                    <span className="text-2xl">{icon.icon}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center truncate w-full">
                      {icon.name}
                    </span>
                  </button>
                ))}
              </div>
            </div> */}

            <div>
              <Label htmlFor="primary-color" className="text-xs font-medium">
                Primary Color
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-10 h-9 p-1 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="flex-1 font-mono text-xs"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* <div>
              <Label className="text-sm">Logo</Label>
              <div
                className={cn(
                  "mt-1.5 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
                  isDraggingLogo ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingLogo(true)
                }}
                onDragLeave={() => setIsDraggingLogo(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingLogo(false)
                  const file = e.dataTransfer.files[0]
                  if (file) handleLogoUpload(file)
                }}
                onClick={() => logoInputRef.current?.click()}
              >
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleLogoUpload(file)
                  }}
                />
                {logoUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={logoUrl || "/placeholder.svg"} alt="Logo preview" className="h-10 w-10 object-contain" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onLogoChange(null)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drop logo here or click to upload</p>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </section>

        {/* Quick Questions Section */}
        {/* <section>
          <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs">3</span>
            Quick Questions
          </h4>

          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                <Input
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="flex-1 text-sm"
                  placeholder="Enter question..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveQuestion(index)}
                  disabled={quickQuestions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {quickQuestions.length < 6 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={handleAddQuestion}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            )}
          </div>
        </section> */}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-background/40 flex gap-2">
        <Button
          className="flex-1 text-white font-medium hover:opacity-90 transition-opacity h-9"
          style={{ backgroundColor: primaryColor }}
          onClick={onSave}
        >
          Claim This Bot
        </Button>
      </div>
    </div>
  );
}
