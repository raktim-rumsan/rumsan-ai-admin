"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Cloud } from "lucide-react";
import { readAndCompressImage } from "browser-image-resizer";
import {
  getBackendFileUrl,
  removeOrganizationLogo,
  useLogoUploadMutation,
  useOrganizationById,
} from "@/queries/organizationQuery";
import { toastUtils } from "@/lib/toast-utils";
import { Card } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

const config = {
  quality: 0.7,
  maxWidth: 200,
  maxHeight: 200,
  autoRotate: true,
  debug: false,
};

interface ImageUploaderProps {
  currentImageUrl?: string;
  uploadMutation: any;
  removeMutation: any;
  deleteId: string;
}

export default function LogoUploader({
  currentImageUrl,
  uploadMutation,
  removeMutation,
  deleteId,
}: ImageUploaderProps) {
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orgContext = useOrganizationContext();

  // Dynamically compute which image to display: preview or backend
  const displayImage = previewImage ?? currentImageUrl ?? null;

  // Handle file selection and compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedBlob = await readAndCompressImage(file, config);
      setCompressedBlob(resizedBlob);

      const reader = new FileReader();
      reader.onload = (event) =>
        setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(resizedBlob);

      setSelectedFile(file); // store original file
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmUpload = () => {
    if (!previewImage || !compressedBlob || !selectedFile) return;

    // Use original name
    const fileToUpload = new File([compressedBlob], selectedFile.name, {
      type: compressedBlob.type,
    });

    uploadMutation.mutate(fileToUpload, {
      onSuccess: async (response: any) => {
        // Try to read backend message from common locations
        const msg =
          response?.data?.message ?? response?.message ?? "Logo uploaded";
        toastUtils.generic.success("Upload successful", msg);
        await orgContext.refetch();
        setPreviewImage(null);
        setCompressedBlob(null);
        setSelectedFile(null);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toastUtils.generic.error("Upload failed", msg);
      },
    });
  };

  // Remove logo
  const handleRemoveLogo = () => {
    removeMutation.mutate(deleteId, {
      onSuccess: async (response: any) => {
        const msg =
          response?.data?.message ?? response?.message ?? "Logo removed";
        toastUtils.generic.success("Logo removed", msg);
        await orgContext.refetch();
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Remove failed";
        toastUtils.generic.error("Remove failed", msg);
      },
    });
  };

  return (
    <Card className="max-w-xs rounded-lg overflow-hidden">
      {/* Top: logo display area */}
      <div
        className="p-6 bg-gray-50 flex items-center justify-center"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Select logo"
      >
        <div className="overflow-hidden bg-white flex items-center justify-center border">
          {displayImage ? (
            <Image
              width={200}
              height={200}
              src={displayImage}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Cloud className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Divider + actions */}
      <div className="border-t bg-white">
        <div className="flex divide-x">
          {/* Left button: Change / Confirm */}
          <div className="w-1/2">
            {previewImage ? (
              // Show Confirm Upload if a new image is selected
              <Button
                className="w-full h-12 rounded-none flex items-center justify-center gap-2 bg-blue-600 text-white"
                onClick={handleConfirmUpload}
              >
                Confirm Upload
              </Button>
            ) : currentImageUrl ? (
              // Show Change if there's already a backend logo
              <Button
                variant="outline"
                className="w-full h-12 rounded-none flex items-center justify-center gap-2"
                onClick={() => {
                  setPreviewImage(null);
                  setCompressedBlob(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Change
              </Button>
            ) : (
              // Show Upload if no backend logo exists
              <Button
                variant="outline"
                className="w-full h-12 rounded-none flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            )}
          </div>

          {/* Right button: Remove */}
          <div className="w-1/2">
            {previewImage ? (
              // Undo button for preview image
              <Button
                variant="ghost"
                className="w-full h-12 rounded-none flex items-center justify-center gap-2"
                onClick={() => {
                  setPreviewImage(null);
                  setCompressedBlob(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <Trash2 className="w-4 h-4" />
                Undo
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-none flex items-center justify-center gap-2"
                    disabled={!currentImageUrl}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove the logo? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveLogo()}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </Card>
  );
}
