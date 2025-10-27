"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LLMSettings } from "@/types/workspace-types";

interface Props {
  llmSettings: LLMSettings;
  setLlmSettings: (settings: LLMSettings) => void;
}

export default function LLMSettingsTab({ llmSettings, setLlmSettings }: Props) {
  // const [llmSettings, setLlmSettings] = useState({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
        <CardDescription className="mt-2">
          Configure the AI model and settings for this workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select
              value={llmSettings.provider}
              onValueChange={(value) =>
                setLlmSettings({ ...llmSettings, provider: value })
              }
            >
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="ollama">Ollama</SelectItem>
                <SelectItem value="grok">Grok</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the AI provider for this workspace
            </p>
          </div>

          {/* Model Selection - Dynamic based on provider */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={llmSettings.model}
              onValueChange={(value) =>
                setLlmSettings({ ...llmSettings, model: value })
              }
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {llmSettings.provider === "openai" && (
                  <>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </>
                )}
                {llmSettings.provider === "ollama" && (
                  <>
                    <SelectItem value="llama2">Llama 2</SelectItem>
                    <SelectItem value="mistral">Mistral</SelectItem>
                    <SelectItem value="codellama">Code Llama</SelectItem>
                  </>
                )}
                {llmSettings.provider === "grok" && (
                  <>
                    <SelectItem value="grok-1">Grok-1</SelectItem>
                    <SelectItem value="grok-1.5">Grok-1.5</SelectItem>
                  </>
                )}
                {llmSettings.provider === "gemini" && (
                  <>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={llmSettings.apiKey}
              onChange={(e) =>
                setLlmSettings({ ...llmSettings, apiKey: e.target.value })
              }
              placeholder="Enter your API key"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is encrypted and securely stored
            </p>
          </div>

          {/* API Endpoint (for Ollama) */}
          {llmSettings.provider === "ollama" && (
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                type="url"
                value={llmSettings.apiEndpoint}
                onChange={(e) =>
                  setLlmSettings({
                    ...llmSettings,
                    apiEndpoint: e.target.value,
                  })
                }
                placeholder="http://localhost:11434"
              />
              <p className="text-xs text-muted-foreground">
                URL of your Ollama server
              </p>
            </div>
          )}

          {/* Advanced Settings */}
          <div className="pt-4 border-t space-y-4">
            <h3 className="text-sm font-semibold">Advanced Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={llmSettings.temperature}
                  onChange={(e) =>
                    setLlmSettings({
                      ...llmSettings,
                      temperature: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Higher values make output more random (0-2)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={llmSettings.maxTokens}
                  onChange={(e) =>
                    setLlmSettings({
                      ...llmSettings,
                      maxTokens: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of generated response
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button>Save Configuration</Button>
            <Button variant="outline">Test Connection</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
