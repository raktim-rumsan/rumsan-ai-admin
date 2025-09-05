"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useDocUploadMutation } from "@/queries/documentsQuery"

interface SimpleFileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export function SimpleFileUploadModal({ isOpen, onClose, onUploadSuccess }: SimpleFileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadMutation = useDocUploadMutation(() => {
  toast.success("File uploaded successfully")
  setSelectedFile(null)
  onUploadSuccess()
  setIsUploading(false)
})

const handleUpload = () => {
  if (!selectedFile) {
    toast.error("Please select a file to upload")
    return
  }
  setIsUploading(true)
  uploadMutation.mutate(selectedFile, {
    onError: () => {
      toast.error("Failed to upload file")
      setIsUploading(false)
    }
  })
}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload File</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-gray-600">Select a file from your computer to upload.</p>
          <div className="space-y-2">
            <Label htmlFor="file-upload">File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">File size shouldn't exceed 10 MB.</AlertDescription>
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
  )
}
