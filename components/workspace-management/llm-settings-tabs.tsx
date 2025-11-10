"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspaceSettingQuery } from "@/queries/workspaceSettingQuery";

export default function LLMConfigPage() {
  const [provider, setProvider] = useState("OpenAI");
  const [chatModel, setChatModel] = useState("GPT-4");
  const [embeddingModel, setEmbeddingModel] = useState(
    "text-embedding-3-small"
  );
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2048");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const { data: workspaceSettings, isPending } = useWorkspaceSettingQuery();

  const handleSave = async () => {
    setIsSaving(true);
    // API call to save configuration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    // API call to test connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTesting(false);
  };
  if (isPending) {
    return <div>Loading...</div>;
  }
  console.log(workspaceSettings, "workspaceSettings");

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
        <CardDescription className="mt-2">
          Configure the AI model and settings for this workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* AI Provider */}
          <div className="space-y-3">
            <Label htmlFor="provider" className="text-base font-semibold">
              AI Provider
            </Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="provider" className="h-12 w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Groq">Groq</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Select the AI provider for this workspace
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Model Selection
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Chat Model */}
              <div className="space-y-3">
                <Label htmlFor="chat-model" className="text-base font-medium">
                  Chat Model
                </Label>
                <Select value={chatModel} onValueChange={setChatModel}>
                  <SelectTrigger id="chat-model" className="h-12 w-full">
                    <SelectValue placeholder="Select chat model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4">GPT-4</SelectItem>
                    <SelectItem value="GPT-4-Turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="GPT-3.5-Turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Embedding Model */}
              <div className="space-y-3">
                <Label
                  htmlFor="embedding-model"
                  className="text-base font-medium"
                >
                  Embedding Model
                </Label>
                <Select
                  value={embeddingModel}
                  onValueChange={setEmbeddingModel}
                >
                  <SelectTrigger id="embedding-model" className="h-12 w-full">
                    <SelectValue placeholder="Select embedding model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-embedding-3-small">
                      text-embedding-3-small
                    </SelectItem>
                    <SelectItem value="text-embedding-3-large">
                      text-embedding-3-large
                    </SelectItem>
                    <SelectItem value="text-embedding-ada-002">
                      text-embedding-ada-002
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-6 border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Advanced Settings
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Temperature */}
              <div className="space-y-3">
                <Label htmlFor="temperature" className="text-base font-medium">
                  Temperature
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="h-12"
                />
                <p className="text-sm text-gray-500">
                  Higher values make output more random (0-2)
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-3">
                <Label htmlFor="max-tokens" className="text-base font-medium">
                  Max Tokens
                </Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  className="h-12"
                />
                <p className="text-sm text-gray-500">
                  Maximum length of generated response
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-12 px-8"
              size="lg"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
            <Button
              onClick={handleTest}
              disabled={isTesting}
              variant="outline"
              className="h-12 px-8 bg-transparent"
              size="lg"
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
