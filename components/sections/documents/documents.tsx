"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, RotateCcw, Trash2 } from "lucide-react"
import { SimpleFileUploadModal } from "@/components/documents/fileUploadModal"
import { useDocsQuery } from "@/queries/documentsQuery"

interface Document {
  id: string
  orgId: string
  fileName: string
  url: string
  status: string
  createdAt: string
}

export default function Documents() {
 
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  const { data, isLoading, error } = useDocsQuery();
  const documents = data?.data || [];


  const handleDelete = async (id: string) => {
    // try {
    //   const { error } = await supabase.from("documents").delete().eq("id", id)

    //   if (error) throw error

    //   toast.success("Document deleted successfully")
    //   fetchDocuments()
    // } catch (error) {
    //   console.error("Error deleting document:", error)
    //   toast.error("Failed to delete document")
    // }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Documents</h1>
        <Button className="bg-black hover:bg-gray-800" onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>FILE NAME</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
  {documents.map((doc: Document) => (
    <TableRow key={doc.id}>
      <TableCell>{formatDate(doc.createdAt)}</TableCell>
      <TableCell>
        {doc.fileName}
      </TableCell>
      <TableCell>{doc.status}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
             {doc.status === "PENDING" ? "Train" : "Retrain"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(doc.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

                </Table>

                {documents.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">No documents uploaded yet</div>
                )}

             
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <SimpleFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {
          setIsUploadModalOpen(false)
        }}
      />
    </div>
  )
}
