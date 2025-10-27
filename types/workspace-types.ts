// types/workspace.ts

export interface Workspace {
  id: string;
  name: string;
  description: string;
  status: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface LLMSettings {
  provider: string;
  model: string;
  temperature: string;
  maxTokens: string;
  apiKey: string;
  apiEndpoint: string;
}

export interface Doc {
  id: string;
  name?: string;
  size?: string;
  uploadedAt?: string;
  enabled: boolean;
}
