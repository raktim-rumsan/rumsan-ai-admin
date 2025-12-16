"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Trash2 } from "lucide-react";
import { toastUtils, dismissToast } from "@/lib/toast-utils";
import { SimpleFileUploadModal } from "@/components/documents/fileUploadModal";
import {
  useDocsQuery,
  useDocDeleteMutation,
  useEmbeddingMutation,
  useUnembeddingMutation,
  viewDocument,
} from "@/queries/documentsQuery";
import { useDocuments, useSetDocuments } from "@/stores/documentsStore";
import { DocumentsResponseSchema } from "@/lib/schemas";
import ConfirmDelete from "@/components/documents/DeleteModal";
import DocumentsTableLoader from "@/components/documents/TableLoader";

interface Document {
  id: string;
  workspaceId: string;
  fileName: string;
  url: string;
  status: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const { workSpaceSlug } = useParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [trainingDocumentId, setTrainingDocumentId] = useState<string | null>(
    null
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentDeleteInfo, setCurrentDeleteInfo] = useState<{
    id: string;
    fileName: string;
  } | null>(null);

  // Use both TanStack Query and Zustand store
  const { data, isLoading, refetch } = useDocsQuery(workSpaceSlug as string);
  const documentsFromStore = useDocuments();
  const setDocuments = useSetDocuments();

  // Prefer store documents if available, otherwise use query data
  const documents =
    documentsFromStore.length > 0 ? documentsFromStore : data?.data || [];
  const currentDocumentCount = documents.length;

  // Sync query data with store when it changes
  useEffect(() => {
    if (data?.data) {
      try {
        const validatedData = DocumentsResponseSchema.parse(data);
        setDocuments(validatedData.data);
      } catch (error) {
        console.error("Failed to validate documents data:", error);
        // Fallback to using raw data
        setDocuments(data.data);
      }
    }
  }, [data, setDocuments]);

  const deleteMutation = useDocDeleteMutation(workSpaceSlug as string, () => {
    toastUtils.data.deleteSuccess("Document");
    // Note: The store will be updated when the query refetches
  });

  const embeddingMutation = useEmbeddingMutation(workSpaceSlug as string);

  const unEmbeddingMutation = useUnembeddingMutation(workSpaceSlug as string);

  const handleTrain = async (
    documentId: string,
    fileName: string,
    isRetrain: boolean
  ) => {
    const action = isRetrain ? "Retraining" : "Training";
    const loadingToastId = toastUtils.generic.loading(`${action} document...`);

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

  const handleDelete = async () => {
    if (!currentDeleteInfo) return;
    const loadingToastId = toastUtils.generic.loading("Deleting document...");

    deleteMutation.mutate(currentDeleteInfo.id, {
      onError: (error: unknown) => {
        dismissToast(loadingToastId);
        const errorMessage = error instanceof Error ? error.message : undefined;
        toastUtils.data.deleteError(errorMessage);
      },
      onSuccess: () => {
        dismissToast(loadingToastId);
        setOpenDeleteModal(false);
        setCurrentDeleteInfo(null);
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">My Resources</h1>
        </div>
        <Button
          className="bg-black hover:bg-gray-800"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="mt-6">
            {isLoading ? (
              <DocumentsTableLoader />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>FILE NAME</TableHead>
                      {/* <TableHead>STATUS</TableHead> */}
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc: Document) => (
                      <TableRow key={doc.id}>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => viewDocument(doc.url)}
                              title={doc.fileName}
                              className="font-medium hover:text-blue-600 cursor-pointer"
                            >
                              {doc.fileName.replaceAll("_", " ")}
                            </button>
                          </div>
                        </TableCell>
                        {/* <TableCell>{doc.status}</TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={doc.status !== "PENDING"}
                                onCheckedChange={(checked) =>
                                  handleTrain(doc.id, doc.fileName, !checked)
                                }
                                disabled={trainingDocumentId === doc.id}
                              />
                              {/* {trainingDocumentId === doc.id && (
                                <RotateCcw className="w-4 h-4 animate-spin" />
                              )}
                              <span className="text-sm text-muted-foreground">
                                {trainingDocumentId === doc.id
                                  ? "Training..."
                                  : doc.status === "PENDING"
                                  ? "Train"
                                  : "Trained"}
                              </span> */}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentDeleteInfo({
                                  id: doc.id,
                                  fileName: doc.fileName,
                                });
                                setOpenDeleteModal(true);
                              }}
                              // onClick={() => handleDelete(doc.id, doc.fileName)}
                              className="text-red-600 hover:text-red-700"
                              disabled={deleteMutation.isPending}
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
                  <div className="text-center py-8 text-gray-500">
                    No documents uploaded yet
                  </div>
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
          setIsUploadModalOpen(false);
          // Manually refetch documents to ensure the list is updated
          refetch();
        }}
        maxDocuments={undefined}
        currentDocumentCount={currentDocumentCount}
        workspaceSlug={workSpaceSlug as string}
      />
      <ConfirmDelete
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        item={currentDeleteInfo?.fileName || ""}
      />
    </div>
  );
}
