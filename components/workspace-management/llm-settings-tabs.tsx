"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Slider } from "@/components/ui/slider";
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
import { z } from "zod";

const validationSchema = z
  .object({
    provider: z.string().min(1, "Provider is required"),
    chatModel: z.string().optional(),
    embeddingModel: z.string().optional(),
    temperature: z.string().optional(),
    maxTokens: z.string().optional(),
    apiKey: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.provider !== "ollama") {
      if (!data.apiKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["apiKey"],
          message: "API Key is required",
        });
        return;
      }

      const isValidKey =
        data.apiKey.length > 50 || data.apiKey.startsWith("sk-");

      if (!isValidKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["apiKey"],
          message: "API key must start with sk-",
        });
      }
    }
  });

type LLMConfigFormData = z.infer<typeof validationSchema>;

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
    resolver: zodResolver(validationSchema),
  });

  const { control, handleSubmit, watch, reset, setValue } = form;
  const provider = watch("provider");

  // Track the specific API key that was successfully tested
  const [lastTestedKey, setLastTestedKey] = useState<string | null>(null);
  // Get provider configuration - returns undefined if provider not found
  const providerConfig: ProviderConfig | undefined = provider
    ? PROVIDER_CONFIG[provider]
    : undefined;

  const apiKeyValue = watch("apiKey") || "";
  const originalApiKey = workspaceSettings?.data?.apiKey || "";

  // Logic Helpers
  const isKeyChanged = apiKeyValue !== originalApiKey;
  const isNewRawKey = apiKeyValue.startsWith("sk-");
  const isCurrentlyTested = lastTestedKey === apiKeyValue;

  // Show Test Button: Provider needs key + key is new + key hasn't been tested yet
  const showTestButton =
    providerConfig?.requiresApiKey &&
    isKeyChanged &&
    isNewRawKey &&
    !isCurrentlyTested &&
    !updateWorkspaceSetting.isPending;

  // Save Disabled:
  const saveDisabled =
    updateWorkspaceSetting.isPending ||
    (providerConfig?.requiresApiKey &&
      isKeyChanged &&
      isNewRawKey &&
      !isCurrentlyTested);

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
      // Clear test state when data is freshly loaded
      setLastTestedKey(null);
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

  const availableChatModels = providerConfig?.chatModels ?? [];
  const availableEmbeddingModels = providerConfig?.embeddingModels ?? [];
  const publicKeyPem = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

  const onSubmit = async (data: LLMConfigFormData) => {
    let finalApiKey = data.apiKey;

    // Only encrypt if it's a NEW raw key that differs from original
    if (providerConfig?.requiresApiKey && isKeyChanged && isNewRawKey) {
      try {
        finalApiKey = await encryptWithPublicKey(publicKeyPem!, data.apiKey);
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
        apiKey: finalApiKey,
      },
      {
        onSuccess: () => {
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
              {provider !== "rumsan_ai" && (
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
              )}
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
                    <Controller
                      name="temperature"
                      control={control}
                      rules={{
                        required: "Temperature is required",
                      }}
                      render={({ field }) => {
                        const rawValue = field.value
                          ? parseFloat(field.value)
                          : 0.7;
                        // Clamp value between 0.1 and 1
                        const value = Math.max(0.1, Math.min(1, rawValue));
                        return (
                          <div className="space-y-3 mt-2">
                            <Slider
                              id="temperature"
                              min={0.1}
                              max={1}
                              step={0.1}
                              value={[value]}
                              onValueChange={(values) => {
                                field.onChange(values[0].toString());
                              }}
                              className="w-full"
                            />
                            <div className="flex justify-between items-center text-sm mb-2">
                              <span className="text-gray-600 font-medium">
                                More Focused
                              </span>
                              <span className="text-gray-500 font-mono">
                                {value % 1 === 0
                                  ? value.toString()
                                  : value.toFixed(1)}
                              </span>
                              <span className="text-gray-600 font-medium">
                                More Creative
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    {form.formState.errors.temperature && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.temperature.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Controls randomness: Lower values produce more focused and
                      deterministic responses, while higher values generate more
                      creative and varied outputs.
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
                      {...form.register("apiKey")}
                      className="h-12 w-full"
                    />
                    {form.formState.errors.apiKey && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.apiKey.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Enter your API key to enable{" "}
                      <span className="font-medium">
                        {PROVIDER.find((p) => p.value === provider)?.label ||
                          "provider"}
                      </span>{" "}
                      services. For your security, the key is{" "}
                      <strong>encrypted before being saved</strong> and will
                      appear in its protected, encrypted format once stored.
                    </p>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={saveDisabled}
                  className="h-12 px-8"
                  size="lg"
                >
                  {updateWorkspaceSetting.isPending
                    ? "Saving..."
                    : "Save Configuration"}
                </Button>

                {showTestButton && (
                  <Button
                    onClick={() =>
                      testConnection(
                        { apiKey: apiKeyValue },
                        { onSuccess: () => setLastTestedKey(apiKeyValue) }
                      )
                    }
                    disabled={isTesting}
                    variant="outline"
                    className="h-12 px-8 bg-transparent"
                    size="lg"
                  >
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
