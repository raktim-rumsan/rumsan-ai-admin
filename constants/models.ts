export const OLLOMA_CHAT_MODELS = [
  { value: "llama3.1:latest", label: "llama3.1:latest" },
];
export const OLLOMA_EMBEDDING_MODELS = [
  { value: "nomic-embed-text:latest", label: "nomic-embed-text:latest" },
];
export const OPENAI_CHAT_MODELS = [
  { value: "gpt-4.1-2025-04-14", label: "GPT-4.1" },
  { value: "gpt-4o-2024-11-20", label: "GPT-4o" },
  { value: "gpt-5-mini", label: "GPT-5 mini" },
  { value: "gpt-5", label: "GPT-5" },
];
export const OPENAI_EMBEDDING_MODELS = [
  { value: "text-embedding-3-small", label: "text-embedding-3-small" },
  { value: "text-embedding-3-large", label: "text-embedding-3-large" },
  { value: "text-embedding-ada-002", label: "text-embedding-ada-002" },
];
export const PROVIDER = [
  { value: "openai", label: "OpenAI" },
  { value: "ollama", label: "Ollama" },
];

// Provider configuration map - scalable solution for multiple providers
export interface ProviderConfig {
  chatModels: Array<{ value: string; label: string }>;
  embeddingModels: Array<{ value: string; label: string }>;
  defaultChatModel: string;
  defaultEmbeddingModel: string;
  requiresApiKey?: boolean;
  apiKeyLabel?: string;
  testConnectionFn?: (apiKey: string) => Promise<void>;
}

export const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  openai: {
    chatModels: OPENAI_CHAT_MODELS,
    embeddingModels: OPENAI_EMBEDDING_MODELS,
    defaultChatModel: "gpt-4.1-2025-04-14",
    defaultEmbeddingModel: "text-embedding-3-small",
    requiresApiKey: true,
    apiKeyLabel: "OpenAI API Key",
  },
  ollama: {
    chatModels: OLLOMA_CHAT_MODELS,
    embeddingModels: OLLOMA_EMBEDDING_MODELS,
    defaultChatModel: "llama3.1:latest",
    defaultEmbeddingModel: "nomic-embed-text:latest",
    requiresApiKey: false,
  },
  // Add more providers here as needed:
  // anthropic: {
  //   chatModels: ANTHROPIC_CHAT_MODELS,
  //   embeddingModels: ANTHROPIC_EMBEDDING_MODELS,
  //   defaultChatModel: "claude-3-opus",
  //   defaultEmbeddingModel: "claude-embedding-v2",
  //   requiresApiKey: true,
  //   apiKeyLabel: "Anthropic API Key",
  // },
};
