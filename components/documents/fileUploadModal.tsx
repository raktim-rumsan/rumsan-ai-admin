"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { toastUtils } from "@/lib/toast-utils";
import { useDocUploadMutation } from "@/queries/documentsQuery";

interface SimpleFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  maxDocuments?: number;
  currentDocumentCount?: number;
  workspaceSlug?: string;
}

export function SimpleFileUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  workspaceSlug,
}: SimpleFileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

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

  const uploadMutation = useDocUploadMutation(workspaceSlug, () => {
    toastUtils.fileUpload.success(selectedFile?.name || "File");
    setSelectedFile(null);
    onUploadSuccess();
    setIsUploading(false);
    onClose(); // Close the modal after successful upload
  });

  const handleUpload = () => {
    if (!selectedFile) {
      toastUtils.generic.error(
        "No file selected",
        "Please select a file to upload"
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
        // Success is handled in the mutation callback above
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setSelectedFile(null);
        setFileError(null);
        onClose();
      }}
    >
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
              className={fileError ? "border-red-600 focus:ring-red-600" : ""}
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
  );
}
