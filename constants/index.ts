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

  //organization routes
  ORGANIZATIONS: `${API_BASE_URL}/organizations`,

  //auth register
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,

  //org-api-key routes
  ORG_API_KEYS: `${API_BASE_URL}/organization-api-key`,
  CREATE_ORG_API_KEY: `${API_BASE_URL}/organization-api-key/create`,
  DELETE_ORG_API_KEY: (apiKeyId: string) =>
    `${API_BASE_URL}/organization-api-key/${apiKeyId}`,

  //query routes
  QUERY: `${API_BASE_URL}/rag/query`,

  //documents routes
  DOCUMENTS: `${API_BASE_URL}/docs`,
  UPLOAD_DOCUMENTS: `${API_BASE_URL}/docs/upload`,
  DELETE_DOCUMENT: (documentId: string) => `${API_BASE_URL}/docs/${documentId}`,

  //embeddings routes
  EMBEDDINGS: `${API_BASE_URL}/embeddings`,
  UNEMBEDDINGS: `${API_BASE_URL}/embeddings/unembed`,
};

export default API_BASE_URL;
