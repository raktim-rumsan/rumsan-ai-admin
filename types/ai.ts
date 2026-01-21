export type AuthEntry = {
  key: string;
  value: string;
  show?: boolean;
  isEncrypted?: boolean;
};

export type FormValues = {
  server?: McpServer;
  authentication: AuthEntry[];
};

export interface McpServer {
  id: string;
  name: string;
  url: string;
  type: string;
  sectorName?: string;
  isActive?: boolean;
  authentication?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  mcpTools?: McpTool[];
}
export interface WorkspaceMcpServer {
  id: string;
  workspaceId: string;
  mcpServerId: string;
  isActive: boolean;
  authentication?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  mcpServer: McpServer;
}

export interface CreateMcpServerPayload {
  mcpServerId: string;
  authentication: Record<string, string>;
}

export interface McpTool {
  id: string;
  mcpServerId?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
}

export interface UpdateMcpServerPayload {
  serverId: string;
  name?: string;
  url?: string;
  sectorName?: string;
  isActive?: boolean;
  authentication?: Record<string, string>;
}
