const serverAPI = process.env.NEXT_PUBLIC_SERVER_API!;
const scraperURL = process.env.NEXT_PUBLIC_SCRAPER_URL!;

const SCRAPER_API_BASE_URL = `${scraperURL}/md`;
const API_BASE_URL = `${serverAPI}/api/v1`;

export const ROUTES = {
  //workspace routes
  MY_WORKSPACE: `${API_BASE_URL}/workspaces/my-workspaces`,
  ORG_WORKSPACE: `${API_BASE_URL}/organizations`,
  ADMIN_WORKSPACE: `${API_BASE_URL}/workspaces/admin`,
  MEMBER: `${API_BASE_URL}/workspaces/members`,
  CREATE_WORKSPACE: `${API_BASE_URL}/workspaces`,
  USERS: `${API_BASE_URL}/workspaces/users`,
  WORKSPACE_SETTING: `${API_BASE_URL}/workspaces/settings`,
  SETTING_SYSTEM_PROMT: `${API_BASE_URL}/workspaces/settings/systemPrompt`,
  WORKSPACEINVITE: `${API_BASE_URL}/workspaces/invite`,
  UPDATE_WORKSPACE: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}`,
  WORKSPACE_MEMBER: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/members`,
  WORKSPACE_MEMBER_DELETE: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/remove-user`,
  DELETE_WORKSPACE: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}`,
  WORKSPACE_IMAGE_UPLOAD: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/photo`,
  WORKSPACE_IMAGE_REMOVE: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/remove-image`,
  MCP_SERVER_TOOLS: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/tools`,
  MCP_SERVER_TOOL_TOGGLE: (workspaceId: string, toolId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/tools/${toolId}`,
  //organization routes
  ORGANIZATIONS: `${API_BASE_URL}/organizations`,
  ORGANIZATION_CONTEXT: `${API_BASE_URL}/organizations/context`,
  ORGANIZATION_ID: (orgId: string) => `${API_BASE_URL}/organizations/${orgId}`,
  ORGANIZATION_UPDATE: (orgId: string) =>
    `${API_BASE_URL}/organizations/${orgId}`,
  ORGANIZATION_LOGO_UPLOAD: (orgId: string) =>
    `${API_BASE_URL}/organizations/${orgId}/logo`,
  ORGANIZATION_LOGO_REMOVE: (orgId: string) =>
    `${API_BASE_URL}/organizations/${orgId}/remove-logo`,

  //auth register
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,

  //org-api-key routes
  ORG_API_KEYS: `${API_BASE_URL}/workspace-api-key`,
  CREATE_ORG_API_KEY: `${API_BASE_URL}/workspace-api-key/create`,
  DELETE_ORG_API_KEY: (apiKeyId: string) =>
    `${API_BASE_URL}/workspace-api-key/${apiKeyId}`,

  //query routes
  QUERY: `${API_BASE_URL}/rag/query`,
  SECTOR_QUERY: `${API_BASE_URL}/rag/industry`,
  RAG_HEALTH: `${API_BASE_URL}/rag/health`,
  QUERY_WITH_API_KEY: `${API_BASE_URL}/rag/query-api`,

  //documents routes
  DOCUMENTS: `${API_BASE_URL}/docs`,
  UPLOAD_DOCUMENTS: `${API_BASE_URL}/docs/upload`,
  DELETE_DOCUMENT: (documentId: string) => `${API_BASE_URL}/docs/${documentId}`,
  KNOWLEDGEBASE: `${API_BASE_URL}/docs/industry-docs`,
  TOGGLE_DOCUMENT_STATUS: (documentId: string) =>
    `${API_BASE_URL}/docs/${documentId}/toggle`,

  //embeddings routes
  EMBEDDINGS: `${API_BASE_URL}/embeddings`,
  UNEMBEDDINGS: `${API_BASE_URL}/embeddings/unembed`,

  //invitations routes
  INVITATION_ACCEPT: `${API_BASE_URL}/invitations/accept`,
  INVITATION_DELETE: (invitationId: string) =>
    `${API_BASE_URL}/invitations/${invitationId}`,
  INVITATION_RESEND: `${API_BASE_URL}/invitations/resend`,
  INVITATION_CHECK: `${API_BASE_URL}/invitations/check`,

  //slack routes
  SLACK_OAUTH_INSTALL: (workspaceId?: string) =>
    `${API_BASE_URL}/widgets/slack/oauth/install${
      workspaceId ? `?workspaceId=${workspaceId}` : ""
    }`,
  SLACK_WORKSPACE_BY_IDENTIFIER: (identifier: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${identifier}`,
  SLACK_CHANNELS: (workspaceId: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${workspaceId}/channels`,
  SLACK_TOGGLE_WORKSPACE: (workspaceId: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${workspaceId}/toggle`,
  SLACK_INSTALL_CHANNEL: (workspaceId: string, channelId: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${workspaceId}/channels/${channelId}/install`,
  SLACK_UNINSTALL_CHANNEL: (workspaceId: string, channelId: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${workspaceId}/channels/${channelId}/uninstall`,
  SLACK_UNINSTALL_WORKSPACE: (workspaceId: string) =>
    `${API_BASE_URL}/widgets/slack/workspaces/${workspaceId}`,

  //scraper routes
  SCRAPER_URL: `${SCRAPER_API_BASE_URL}`,
};

export default API_BASE_URL;
