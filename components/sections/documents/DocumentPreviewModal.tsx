"use client";

import React from "react";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
interface PDFViewerProps {
  fileUrl: string;
  onPageChange?: (pageNumber: number) => void;
  selectedPage?: number;
}

export function PDFViewer({ fileUrl, onPageChange, selectedPage }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const onDocumentLoadError = useCallback(
    (error: Error) => {
      console.error("PDF load error:", error);
      setIsLoading(false);
      setFetchError(
        "Failed to load PDF. This may be due to file permissions or CORS restrictions. " +
          "Please ensure the file is publicly accessible and try again."
      );
      toast({
        title: "Error loading PDF",
        description: "Unable to load the PDF document. Please check file permissions and CORS.",
        variant: "destructive",
      });
    },
    [toast]
  );

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
      onPageChange?.(page);
    }
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  // Update page number when selectedPage prop changes
  React.useEffect(() => {
    if (selectedPage && selectedPage !== pageNumber) {
      setPageNumber(selectedPage);
    }
  }, [selectedPage, pageNumber]);

  // Log fileUrl for debugging
  React.useEffect(() => {
    if (fileUrl) {
      console.log("PDFViewer fileUrl:", fileUrl);
    }
  }, [fileUrl]);

  return (
    <div className="flex flex-col h-full">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => goToPage(Number.parseInt(e.target.value) || 1)}
              className="w-16 text-center"
            />
            <span className="text-sm text-muted-foreground">of {numPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {fetchError ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="text-red-500 mb-2 font-semibold">{fetchError}</div>
              <div className="text-xs text-muted-foreground break-all max-w-xl">
                <strong>File URL:</strong> {fileUrl}
              </div>
            </div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className="shadow-lg"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="border bg-white"
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}