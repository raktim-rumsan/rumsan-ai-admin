"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankConfig } from "@/lib/customize-bank-data";
import { BankSelector } from "./banking-selector";
import { ChatbotPreview } from "./chatbot-banking-select";
import { CustomizationPanel } from "./customize-chatbot-pannel";

export function DemoWorkspace() {
  const [selectedBank, setSelectedBank] = useState<BankConfig | null>(null);
  const [customName, setCustomName] = useState("");
  const [customAssistantName, setCustomAssistantName] = useState("");
  const [customTagline, setCustomTagline] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [selectedBotIcon, setSelectedBotIcon] = useState("🤖");
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [enabledPdfs, setEnabledPdfs] = useState<boolean[]>([]);

  const handleSelectBank = (bank: BankConfig) => {
    setSelectedBank(bank);
    setCustomName(bank.name);
    setCustomAssistantName(bank.name);
    setCustomTagline(bank.tagline);
    setCustomColor(bank.primaryColor);
    setCustomQuestions([...bank.quickQuestions]);
    setLogoUrl(null);
    setUploadedPdf(null);
    setSelectedBotIcon("🤖");
    setUploadedPdfs([]);
    setEnabledPdfs([]);
  };

  const handleBack = () => {
    setSelectedBank(null);
    setLogoUrl(null);
    setUploadedPdf(null);
  };

  const handlePdfUpload = (file: File | null) => {
    if (file) {
      setUploadedPdf(file);
      setUploadedPdfs([file]);
      setEnabledPdfs([true]);
    } else {
      setUploadedPdf(null);
      setUploadedPdfs([]);
      setEnabledPdfs([]);
    }
  };

  const handleRemovePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
    setEnabledPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePdf = (index: number) => {
    setEnabledPdfs((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  if (!selectedBank) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <BankSelector
          onSelectBank={handleSelectBank}
          selectedBankId={selectedBank?.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Banks
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: customColor }}
              />
              <span className="font-medium text-foreground">{customName}</span>
              <span className="text-sm text-muted-foreground">
                Preview Mode
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Chatbot Preview - Left Side */}
          <div className="order-2 lg:order-1">
            <ChatbotPreview
              bankName={customName}
              assistantName={customAssistantName}
              tagline={customTagline}
              primaryColor={customColor}
              quickQuestions={customQuestions}
              logoUrl={logoUrl || undefined}
              botIcon={selectedBotIcon}
            />
          </div>

          {/* Customization Panel - Right Side */}
          <div className="order-1 lg:order-2">
            <CustomizationPanel
              bankName={customName}
              assistantName={customAssistantName}
              tagline={customTagline}
              primaryColor={customColor}
              quickQuestions={customQuestions}
              onNameChange={setCustomName}
              onAssistantNameChange={setCustomAssistantName}
              onTaglineChange={setCustomTagline}
              onColorChange={setCustomColor}
              onLogoChange={setLogoUrl}
              onQuickQuestionsChange={setCustomQuestions}
              onPdfUpload={handlePdfUpload}
              uploadedPdf={uploadedPdf}
              logoUrl={logoUrl}
              selectedBotIcon={selectedBotIcon}
              onBotIconChange={setSelectedBotIcon}
              uploadedPdfs={uploadedPdfs}
              onRemovePdf={handleRemovePdf}
              enabledPdfs={enabledPdfs}
              onTogglePdf={handleTogglePdf}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
