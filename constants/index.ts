const serverAPI = process.env.NEXT_PUBLIC_SERVER_API!;

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
  WORKSPACE_MEMBER: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/members`,
  WORKSPACE_MEMBER_DELETE: (workspaceId: string) =>
    `${API_BASE_URL}/workspaces/${workspaceId}/remove-user`,

  //organization routes
  ORGANIZATIONS: `${API_BASE_URL}/organizations`,
  ORGANIZATION_CONTEXT: `${API_BASE_URL}/organizations/context`,

  //auth register
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,

  //org-api-key routes
  ORG_API_KEYS: `${API_BASE_URL}/organization-api-key`,
  CREATE_ORG_API_KEY: `${API_BASE_URL}/organization-api-key/create`,
  DELETE_ORG_API_KEY: (apiKeyId: string) =>
    `${API_BASE_URL}/organization-api-key/${apiKeyId}`,

  //query routes
  QUERY: `${API_BASE_URL}/rag/query`,
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
};

export default API_BASE_URL;
