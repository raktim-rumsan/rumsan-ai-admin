"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { TooltipWrapper } from "@/components/common/ToolTipProvider";
import { Trash2, RefreshCw, SquarePen } from "lucide-react";
import { CapturedContent } from "@/types/web-documents";

interface Props {
  webDocuments?: CapturedContent[];
  formatDate: (dateString: string) => string;
  cropUrl: (url: string) => string;
  handleLoadContentForEdit: (doc: any) => void;
  fetchOrRefreshContent: (
    url: string,
    existingContent?: CapturedContent
  ) => void;
  handleEmbedding: (id: string, isEnabled: boolean) => void;
  onDeleteClick: (doc: CapturedContent) => void;
  embeddingPending: boolean;
  unEmbeddingPending: boolean;
  deletePending: boolean;
}

export default function WebDocumentsTable({
  webDocuments,
  formatDate,
  cropUrl,
  handleLoadContentForEdit,
  fetchOrRefreshContent,
  handleEmbedding,
  onDeleteClick,
  embeddingPending,
  unEmbeddingPending,
  deletePending,
}: Props) {
  return (
    <Card>
      <CardContent>
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>URL</TableHead>

                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(webDocuments?.length ?? 0) > 0 ? (
                webDocuments!.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(doc.createdAt || "")}
                    </TableCell>
                    <TableCell>
                      <div
                        className="text-muted-foreground text-sm max-w-xs inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                        title={doc.url}
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        <span>{cropUrl(doc.url)}</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipWrapper label="View & Edit">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadContentForEdit(doc)}
                          >
                            <SquarePen className="size-4" />
                          </Button>
                        </TooltipWrapper>

                        <TooltipWrapper label="Refresh">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchOrRefreshContent(doc.url, doc)}
                          >
                            <RefreshCw className="size-4" />
                          </Button>
                        </TooltipWrapper>
                        <TooltipWrapper
                          label={
                            doc.status !== "PENDING"
                              ? "Disable Training"
                              : "Enable Training"
                          }
                        >
                          <div
                            className="inline-flex cursor-pointer"
                            aria-label={
                              doc.status !== "PENDING"
                                ? "Disable Training"
                                : "Enable Training"
                            }
                          >
                            <Switch
                              checked={doc.status !== "PENDING"}
                              onCheckedChange={(checked) =>
                                handleEmbedding(doc.id, checked)
                              }
                              disabled={embeddingPending || unEmbeddingPending}
                            />
                          </div>
                        </TooltipWrapper>

                        <TooltipWrapper label="Delete">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteClick(doc)}
                            className="text-destructive hover:text-destructive cursor-pointer"
                            disabled={deletePending}
                            aria-label="Delete"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipWrapper>
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
      </CardContent>
    </Card>
  );
}
