"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useGoogleDriveDocMutation } from "@/queries/documentsQuery"

interface GoogleDriveUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export default function GoogleDriveUploadModal({ isOpen, onClose, onUploadSuccess }: GoogleDriveUploadModalProps) {
  const [driveType, setDriveType] = useState<"private" | "public">("public")
  const [driveUrl, setDriveUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const serviceEmail = "rumsan-ai-dev@rumsan-ai.iam.gserviceaccount.com"

  const mutation = useGoogleDriveDocMutation(() => {
    toast.success("Google Drive file uploaded successfully")
    setDriveUrl("")
    setIsUploading(false)
    onUploadSuccess()
    onClose()
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(serviceEmail)
      toast.success("Email copied to clipboard")
    } catch {
      toast.error("Failed to copy email")
    }
  }

  const handleUpload = async () => {
    if (!driveUrl.trim()) {
      toast.error("Please enter a Google Drive URL")
      return
    }
    if (!driveUrl.includes("drive.google.com")) {
      toast.error("Please enter a valid Google Drive URL")
      return
    }

    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
    const fileId = fileIdMatch ? fileIdMatch[1] : null
    if (!fileId) {
      toast.error("Invalid Google Drive URL format")
      return
    }

    setIsUploading(true)
    toast.message("Uploading...", { description: "Please wait while we register your Google Drive file." })

    // Fetch file name from Google Drive API
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
      const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name&key=${apiKey}`);
      if (!metaRes.ok) throw new Error("Failed to fetch file metadata from Google Drive");
      const metaData = await metaRes.json();
      const fileName = metaData.name || `drive_${fileId}`;
      console.log( fileName), "filename";

      mutation.mutate(
        {
          fileName,
          url: driveUrl,
          driveFileId: fileId,
        },
        {
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Upload failed"
            toast.error(errorMessage)
            setIsUploading(false)
          },
        }
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch file name from Google Drive")
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Google Drive</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600">Add a Google Drive link to your files. Choose whether it's a private or public drive.</p>

          {/* Drive Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={driveType === "private" ? "default" : "outline"}
              onClick={() => setDriveType("private")}
              className="flex-1"
            >
              Private Drive
            </Button>
            <Button
              variant={driveType === "public" ? "default" : "outline"}
              onClick={() => setDriveType("public")}
              className="flex-1"
            >
              Public Drive
            </Button>
          </div>

          {/* Important Notice */}
          {driveType === "private" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Important:</p>
                  <p>
                    Please share your Google Drive file with{" "}
                    <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">{serviceEmail}</span>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="ml-1 h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </p>
                  <p>
                    with <strong>Editor access</strong> before uploading to ensure we can properly view and manage your file.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Drive URL Input */}
          <div className="space-y-2">
            <Label htmlFor="drive-url">Drive URL</Label>
            <Input
              id="drive-url"
              placeholder="https://drive.google.com/..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
            />
          </div>

          {/* File Size Warning */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">File size shouldn't exceed 10 MB.</AlertDescription>
          </Alert>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !driveUrl.trim()}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
