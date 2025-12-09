"use client";
import { useEffect, useState } from "react";
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
import {
  useTestConnection,
  useUpdateWorkspaceSetting,
  useWorkspaceSettingQuery,
} from "@/queries/workspaceSettingQuery";
import LLMConfigurationSkeleton from "./llm-setting-loading";
import {
  OLLOMA_CHAT_MODELS,
  OLLOMA_EMBEDDING_MODELS,
  OPENAI_CHAT_MODELS,
  OPENAI_EMBEDDING_MODELS,
  PROVIDER,
} from "@/constants/models";

export default function LLMConfigPage() {
  const [config, setConfig] = useState({
    provider: "",
    chatModel: "",
    embeddingModel: "",
    temperature: "",
    maxTokens: "",
    apiKey: "",
  });
  const { data: workspaceSettings, isPending } = useWorkspaceSettingQuery();
  const updateWorkspaceSetting = useUpdateWorkspaceSetting();

  const { mutate: testConnection, isPending: isTesting } = useTestConnection();

  useEffect(() => {
    if (workspaceSettings) {
      setConfig({
        chatModel: workspaceSettings.data.llmModel ?? "",
        embeddingModel: workspaceSettings.data.embeddingModel ?? "",
        temperature: workspaceSettings.data.temperature?.toString(),
        maxTokens: workspaceSettings.data.maxTokensPerQuery?.toString(),
        provider: workspaceSettings.data.provider,
        apiKey: workspaceSettings.data.apiKey || "",
      });
    }
  }, [workspaceSettings]);

  useEffect(() => {
    if (!workspaceSettings) return;
    if (config.provider === "openai") {
      setConfig((prev) => ({
        ...prev,
        chatModel:
          workspaceSettings?.data.provider === "openai"
            ? workspaceSettings?.data.llmModel
            : "gpt-4.1-2025-04-14",
        embeddingModel:
          workspaceSettings?.data.provider === "openai"
            ? workspaceSettings?.data.embeddingModel
            : "text-embedding-3-small",
      }));
    } else if (config.provider === "ollama") {
      setConfig((prev) => ({
        ...prev,
        chatModel:
          workspaceSettings?.data.provider === "ollama"
            ? workspaceSettings?.data.llmModel
            : "llama3.1:latest",
        embeddingModel:
          workspaceSettings?.data.provider === "ollama"
            ? workspaceSettings?.data.embeddingModel
            : "nomic-embed-text:latest",
      }));
    }
  }, [config.provider]);

  const availableChatModels =
    config.provider === "openai" ? OPENAI_CHAT_MODELS : OLLOMA_CHAT_MODELS;

  const availableEmbeddingModels =
    config.provider === "openai"
      ? OPENAI_EMBEDDING_MODELS
      : OLLOMA_EMBEDDING_MODELS;

  const handleSave = async () => {
    updateWorkspaceSetting.mutate({
      provider: config.provider,
      llmModel: config.chatModel,
      embeddingModel: config.embeddingModel,
      maxTokensPerQuery: Number(config.maxTokens),
      temperature: parseFloat(config.temperature),
      apiKey: config.apiKey,
    });
  };

  return (
    <>
      {isPending ? (
        <LLMConfigurationSkeleton />
      ) : (
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
                <Select
                  value={config.provider}
                  onValueChange={(provider) =>
                    setConfig((prev) => ({ ...prev, provider }))
                  }
                >
                  <SelectTrigger id="provider" className="h-12 w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
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
                    <Label
                      htmlFor="chat-model"
                      className="text-base font-medium"
                    >
                      Chat Model
                    </Label>
                    <Select
                      value={config.chatModel}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, chatModel: value }))
                      }
                    >
                      <SelectTrigger id="chat-model" className="h-12 w-full">
                        <SelectValue placeholder="Select chat model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableChatModels.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
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
                      value={config.embeddingModel}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          embeddingModel: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        id="embedding-model"
                        className="h-12 w-full"
                      >
                        <SelectValue placeholder="Select embedding model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEmbeddingModels.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.value}
                          </SelectItem>
                        ))}
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
                    <Label
                      htmlFor="temperature"
                      className="text-base font-medium"
                    >
                      Temperature
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={config.temperature}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          temperature: e.target.value,
                        }))
                      }
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500">
                      Higher values make output more random (0-2)
                    </p>
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="max-tokens"
                      className="text-base font-medium"
                    >
                      Max Tokens
                    </Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          maxTokens: e.target.value,
                        }))
                      }
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500">
                      Maximum length of generated response
                    </p>
                  </div>
                </div>
              </div>

              {/* API Key*/}
              <div>
                {config.provider === "openai" && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="api-key"
                      className="text-base font-semibold"
                    >
                      OpenAI API Key
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={config.apiKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          apiKey: e.target.value,
                        }))
                      }
                      className="h-12 w-full"
                    />
                    <p className="text-sm text-gray-500">
                      Enter your OpenAI API key to enable OpenAI services.
                    </p>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateWorkspaceSetting.isPending}
                  className="h-12 px-8"
                  size="lg"
                >
                  {updateWorkspaceSetting.isPending
                    ? "Saving..."
                    : "Save Configuration"}
                </Button>

                {config.provider === "openai" ? (
                  <Button
                    onClick={() => testConnection({ apiKey: config.apiKey })}
                    disabled={isTesting}
                    variant="outline"
                    className="h-12 px-8 bg-transparent"
                    size="lg"
                  >
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
