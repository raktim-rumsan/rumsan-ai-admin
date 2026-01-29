"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────
// Dummy data — matches your screenshots quite closely
// ────────────────────────────────────────────────
const DUMMY_DOCUMENTS = [
  {
    id: "acc-guide",
    name: "Account Opening Guide",
    description: "Step-by-step account opening procedures",
    size: "2.4 MB",
  },
  {
    id: "loan-brochure",
    name: "Loan Products Brochure",
    description: "Complete loan offerings and rates",
    size: "1.8 MB",
  },
  {
    id: "digital-manual",
    name: "Digital Banking Manual",
    description: "Online and mobile banking user guide",
    size: "3.2 MB",
  },
  {
    id: "fee-2024",
    name: "Fee Schedule 2024",
    description: "Current fees and charges",
    size: "0.5 MB",
  },
];

export function CustomizationPanel() {
  const [enabledDocs, setEnabledDocs] = useState<string[]>(["acc-guide"]); // example: only first one enabled

  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [bankName, setBankName] = useState("NMB Bank");
  const [tagline, setTagline] = useState("Bank for All");
  const [primaryColor, setPrimaryColor] = useState("#E31837");

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  // ─── Handlers ───────────────────────────────────────

  const toggleDocument = (docId: string) => {
    setEnabledDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const handlePdfUpload = (file: File | null) => {
    if (!file || file.type !== "application/pdf") return;
    setUploadedPdf(file);
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  };

  const handleSave = () => {
    console.log("Saving configuration:", {
      bankName,
      tagline,
      primaryColor,
      logoUrl,
      enabledDocs,
      uploadedPdf: uploadedPdf?.name,
    });
    // real save logic here
  };

  const handleReset = () => {
    setBankName("NMB Bank");
    setTagline("Bank for All");
    setPrimaryColor("#E31837");
    setLogoUrl(null);
    setUploadedPdf(null);
    setEnabledDocs(["acc-guide"]);
  };

  return (
    <div className="flex flex-col h-[720px] bg-white rounded-2xl border shadow-lg overflow-hidden max-w-[420px] mx-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b bg-white">
        <h3 className="font-semibold text-foreground">Customization</h3>
        <p className="text-sm text-muted-foreground">
          Configure the assistant appearance
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. Knowledge Base */}
        <section>
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">
              1
            </span>
            Knowledge Base
          </h4>

          <div className="space-y-2.5">
            {DUMMY_DOCUMENTS.map((doc) => {
              const isEnabled = enabledDocs.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    isEnabled
                      ? "bg-blue-50 border-blue-100"
                      : "bg-white border-border",
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-muted/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {doc.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {doc.size}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleDocument(doc.id)}
                      className="mt-0.5 h-6 w-11 data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground mt-3">
            Toggle documents to include in the assistant's knowledge base
          </p>

          {/* Upload new PDF */}
          <div className="mt-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer",
                isDraggingPdf
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPdf(true);
              }}
              onDragLeave={() => setIsDraggingPdf(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPdf(false);
                handlePdfUpload(e.dataTransfer.files[0] ?? null);
              }}
              onClick={() => pdfInputRef.current?.click()}
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handlePdfUpload(e.target.files?.[0] ?? null)}
              />

              {uploadedPdf ? (
                <div className="flex items-center justify-center gap-3 py-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted/60">
                    <FileText className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {uploadedPdf.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePdfUpload(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Upload PDF Document
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Train the assistant with your bank's documentation
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground mt-2">
              1 PDF file only, max 10MB
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        {/* 2. Branding */}
        <section>
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium">
              2
            </span>
            Branding
          </h4>

          <div className="space-y-5">
            <div>
              <Label className="text-sm">Assistant Name</Label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm">Tagline</Label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm">Primary Color</Label>
              <div className="flex gap-2.5 mt-1.5">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-14 h-10 p-1 cursor-pointer rounded-md"
                />
                <Input
                  value={primaryColor.toUpperCase()}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Logo</Label>
              <div
                className={cn(
                  "mt-1.5 border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer min-h-[110px] flex items-center justify-center",
                  isDraggingLogo
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingLogo(true);
                }}
                onDragLeave={() => setIsDraggingLogo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingLogo(false);
                  handleLogoUpload(e.dataTransfer.files[0] ?? null);
                }}
                onClick={() => logoInputRef.current?.click()}
              >
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleLogoUpload(e.target.files?.[0] ?? null)
                  }
                />

                {logoUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-12 w-12 object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoUrl(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drop logo here or click to upload
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t bg-white mt-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-md h-11 bg-white text-sm"
            onClick={handleReset}
          >
            Reset to Default
          </Button>
          <Button
            className="flex-1 text-white rounded-md h-11 shadow-md text-sm"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
