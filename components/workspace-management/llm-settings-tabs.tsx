"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "next/navigation";
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
  PROVIDER,
  PROVIDER_CONFIG,
  type ProviderConfig,
} from "@/constants/models";
import { encryptWithPublicKey } from "@/lib/encrypt";

interface LLMConfigFormData {
  provider: string;
  chatModel: string;
  embeddingModel: string;
  temperature: string;
  maxTokens: string;
  apiKey: string;
}

export default function LLMConfigPage() {
  const params = useParams();
  const workSpaceSlug = params?.workSpaceSlug as string;

  const { data: workspaceSettings, isPending } =
    useWorkspaceSettingQuery(workSpaceSlug);
  const updateWorkspaceSetting = useUpdateWorkspaceSetting(workSpaceSlug);
  const { mutate: testConnection, isPending: isTesting } = useTestConnection();

  const form = useForm<LLMConfigFormData>({
    defaultValues: {
      provider: "",
      chatModel: "",
      embeddingModel: "",
      temperature: "",
      maxTokens: "",
      apiKey: "",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty },
  } = form;
  const provider = watch("provider");
  const [isTestSuccessful, setIsTestSuccessful] = useState(false);

  // Get provider configuration - returns undefined if provider not found
  const providerConfig: ProviderConfig | undefined = provider
    ? PROVIDER_CONFIG[provider]
    : undefined;
  const showTestButton = providerConfig?.requiresApiKey && isDirty;

  const saveDisabled = providerConfig?.requiresApiKey && !isTestSuccessful;

  // Initialize form with workspace settings
  useEffect(() => {
    if (workspaceSettings?.data) {
      reset({
        chatModel: workspaceSettings.data.llmModel ?? "",
        embeddingModel: workspaceSettings.data.embeddingModel ?? "",
        temperature: workspaceSettings.data.temperature?.toString() ?? "",
        maxTokens: workspaceSettings.data.maxTokensPerQuery?.toString() ?? "",
        provider: workspaceSettings.data.provider,
        apiKey: workspaceSettings.data.apiKey || "",
      });
    }
  }, [workspaceSettings, reset]);

  useEffect(() => {
    if (!workspaceSettings?.data || !provider || !providerConfig) return;

    const isSameProvider = workspaceSettings.data.provider === provider;
    const chatModel = isSameProvider
      ? workspaceSettings.data.llmModel ?? ""
      : providerConfig.defaultChatModel;
    const embeddingModel = isSameProvider
      ? workspaceSettings.data.embeddingModel ?? ""
      : providerConfig.defaultEmbeddingModel;

    setValue("chatModel", chatModel);
    setValue("embeddingModel", embeddingModel);
  }, [provider, workspaceSettings, setValue, providerConfig]);

  // Get available models from provider config
  const availableChatModels = providerConfig?.chatModels ?? [];
  const availableEmbeddingModels = providerConfig?.embeddingModels ?? [];
  const publicKeyPem = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

  const onSubmit = async (data: LLMConfigFormData) => {
    // Validation for required fields
    if (!data.temperature || !data.maxTokens) {
      form.setError("temperature", { message: "Temperature is required" });
      form.setError("maxTokens", { message: "Max Tokens is required" });
      return;
    }

    let encryptedApiKey = "";
    // Only encrypt if the provider requires an API key
    if (providerConfig?.requiresApiKey && data.apiKey) {
      try {
        encryptedApiKey = await encryptWithPublicKey(
          publicKeyPem!,
          data.apiKey
        );
      } catch (err) {
        console.error("Failed to encrypt API key:", err);
        return;
      }
    }
    updateWorkspaceSetting.mutate(
      {
        provider: data.provider,
        llmModel: data.chatModel,
        embeddingModel: data.embeddingModel,
        maxTokensPerQuery: Number(data.maxTokens),
        temperature: parseFloat(data.temperature),
        apiKey: encryptedApiKey,
      },
      {
        onSuccess: () => {
          setIsTestSuccessful(false);
          reset(form.getValues());
        },
      }
    );
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
                <Controller
                  name="provider"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
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
                    <Controller
                      name="chatModel"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="chat-model"
                            className="h-12 w-full"
                          >
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
                      )}
                    />
                  </div>

                  {/* Embedding Model */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="embedding-model"
                      className="text-base font-medium"
                    >
                      Embedding Model
                    </Label>
                    <Controller
                      name="embeddingModel"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={true}
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
                      )}
                    />
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
                      max="1"
                      {...form.register("temperature", {
                        required: "Temperature is required",
                      })}
                      className="h-12"
                    />
                    {form.formState.errors.temperature && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.temperature.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Higher values make output more random (0-1)
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
                      step="1"
                      min="2000"
                      max="4000"
                      {...form.register("maxTokens", {
                        required: "Max Tokens is required",
                        validate: (value) => {
                          const num = Number(value);
                          if (isNaN(num)) return "Max Tokens must be a number";
                          if (num < 2000)
                            return "Max Tokens cannot be less than 2000";
                          if (num > 4000)
                            return "Max Tokens cannot be greater than 4000";
                          return true;
                        },
                      })}
                      className="h-12"
                    />
                    {form.formState.errors.maxTokens && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.maxTokens.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Maximum length of generated response (2000-4000)
                    </p>
                  </div>
                </div>
              </div>

              {/* API Key*/}
              <div>
                {providerConfig?.requiresApiKey && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="api-key"
                      className="text-base font-semibold"
                    >
                      {providerConfig.apiKeyLabel || "API Key"}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      {...form.register("apiKey", {
                        required: providerConfig.requiresApiKey
                          ? "API Key is required"
                          : false,
                        onChange: (e) => {
                          setIsTestSuccessful(false);
                        },
                      })}
                      className="h-12 w-full"
                    />
                    {form.formState.errors.apiKey && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.apiKey.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Enter your API key to enable&nbsp;
                      {PROVIDER.find((p) => p.value === provider)?.label ||
                        "provider"}
                      &nbsp;services.
                    </p>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={saveDisabled || updateWorkspaceSetting.isPending}
                  className="h-12 px-8"
                  size="lg"
                >
                  {updateWorkspaceSetting.isPending
                    ? "Saving..."
                    : "Save Configuration"}
                </Button>

                {showTestButton && providerConfig?.requiresApiKey ? (
                  <Button
                    onClick={() =>
                      testConnection(
                        { apiKey: form.getValues("apiKey") },
                        {
                          onSuccess: () => setIsTestSuccessful(true),
                        }
                      )
                    }
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
