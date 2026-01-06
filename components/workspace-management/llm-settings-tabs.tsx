"use client";
import { useCallback, useEffect, useState } from "react";
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
import * as yup from "yup";

interface LLMConfigFormData {
  provider: string;
  chatModel: string;
  embeddingModel: string;
  temperature: string;
  maxTokens: string;
  apiKey: string;
}

const useYupValidationResolver = (validationSchema: any) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });
        return { values, errors: {} };
      } catch (err: any) {
        return {
          values: {},
          errors: err.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

const validationSchema = yup.object({
  provider: yup.string().required(),
  apiKey: yup.string().when("provider", {
    is: (val: string) => val !== "ollama",
    then: (schema) =>
      schema
        .required("API Key is required")
        .test("is-valid-key", "API key must start with sk-", (value) => {
          if (!value) return false;
          // Allow if it's the long encrypted string OR starts with sk-
          return value.length > 50 || value.startsWith("sk-");
        }),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

export default function LLMConfigPage() {
  const resolver = useYupValidationResolver(validationSchema);
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
    resolver,
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
