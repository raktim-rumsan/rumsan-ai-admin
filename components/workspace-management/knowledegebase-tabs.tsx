"use client";

import { FileText } from "lucide-react";
import {
  useKnowledgebaseQuery,
  useToggleDocumentStatusMutation,
  viewDocument,
} from "@/queries/documentsQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import KnowledgebaseStats from "./knowlege-stats";
import { useWorkspaceRole } from "@/hooks/useOrganizationContext";
import {
  KnowledgebaseError,
  KnowledgebaseLoading,
} from "./knowledgebase-loading";
import { useParams } from "next/navigation";
import { useWorkspaceQuery } from "@/queries/workspaceQuery";

export default function KnowledgebaseTab() {
  const params = useParams();
  const workSpaceSlug = params?.workSpaceSlug as string;

  // Fetch workspace to get ID from slug
  const { data: workspaceData } = useWorkspaceQuery();
  const currentWorkspace = workspaceData?.data?.myWorkspaces?.find(
    (w) => w.slug === workSpaceSlug
  );
  const workspaceId = currentWorkspace?.id || "";
  const sector = currentWorkspace?.sector;

  const {
    data: fetchedDocs = [],
    isLoading,
    isFetched,
    error,
  } = useKnowledgebaseQuery(workSpaceSlug, sector!);

  const { isAdmin } = useWorkspaceRole(workspaceId || "");

  const processedDocs = fetchedDocs.filter((doc) => doc.status === "PROCESSED");
  const visibleDocs = isAdmin
    ? processedDocs
    : processedDocs.filter((doc) => doc.enabled);

  const toggleMutation = useToggleDocumentStatusMutation(workSpaceSlug);
  const handleToggle = (documentId: string) => {
    toggleMutation.mutate(documentId);
  };

  if (error) return <KnowledgebaseError error={error} />;

  if (!isFetched || isLoading) return <KnowledgebaseLoading />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Industry Knowledgebase</CardTitle>
              <CardDescription className="mt-2">
                Manage industry knowledge that the AI can reference.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fetchedDocs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              visibleDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => viewDocument(doc.url)}
                        title={doc.fileName}
                        className="font-medium hover:text-blue-600 cursor-pointer"
                      >
                        {doc.fileName.replaceAll("_", " ")}
                      </button>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {doc.industry.charAt(0).toUpperCase() +
                            doc.industry.slice(1)}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Uploaded{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={doc.enabled}
                          onCheckedChange={() => handleToggle(doc.id)}
                        />
                        <span
                          className={`text-sm font-medium ${
                            doc.enabled ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {doc.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <KnowledgebaseStats knowledgebase={processedDocs} />
    </div>
  );
}
