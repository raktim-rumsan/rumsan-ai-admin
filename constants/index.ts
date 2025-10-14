const serverAPI = process.env.NEXT_PUBLIC_SERVER_API!;

const API_BASE_URL = `${serverAPI}/api/v1`;

export const ROUTES = {
  MY_WORKSPACE: `${API_BASE_URL}/workspaces/my-workspaces`,
  MEMBER: `${API_BASE_URL}/workspaces/members`,
  CREATE_WORKSPACE: `${API_BASE_URL}/workspaces`,
  WORKSPACE_SETTING: `${API_BASE_URL}/workspaces/settings`,
  SETTING_SYSTEM_PROMT: `${API_BASE_URL}/workspaces/settings/systemPrompt`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  USERS: `${API_BASE_URL}/workspaces/users`,
};

export default API_BASE_URL;
