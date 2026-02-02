import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";
import { toastUtils } from "./toast-utils";
import { WORKSPACE_NAME_TO_ENV_KEY } from "@/constants/chatbot-demo-bank";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
  return match ? match[1] : null;
}

export function getApiKey() {
  if (typeof window === "undefined") return null;
  return process.env.NEXT_PUBLIC_API_KEY || null;
}
export function generateRandomPassword(length: number = 16): string {
  return randomBytes(length).toString("hex");
}

export function orgContext(key?: string) {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("organizationContext");
  const parsed = raw ? JSON.parse(raw) : null;
  if (!key) return parsed; // return whole context if no key
  return parsed?.[key];
}

export function formatRole(role: string | undefined | null): string {
  return role?.replace(/_/g, " ") ?? "";
}

export function truncateMiddleUrl(url: string, maxStart = 12, maxEnd = 8) {
  if (url.length <= maxStart + maxEnd + 3) return url; // short enough, no truncation
  const start = url.slice(0, maxStart);
  const end = url.slice(-maxEnd);
  return `${start}...${end}`;
}

export function humanizeToolName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Utils For Demo Chat Bot Start **/
export function getBankApiKey(bank: string) {
  if (typeof window === "undefined") return null;
  try {
    const bankKeys = JSON.parse(process.env.NEXT_PUBLIC_BANK_KEYS || "{}");
    const bankConfig = bankKeys[bank];

    if (typeof bankConfig === "string") {
      return bankConfig; // Old format
    }
    if (bankConfig && typeof bankConfig === "object" && bankConfig.apiKey) {
      return bankConfig.apiKey; // New format
    }
    return null;
  } catch (error) {
    console.error("Error parsing bank keys:", error);
    return null;
  }
}

/**
 * Get all API keys from NEXT_PUBLIC_BANK_KEYS environment variable
 * Returns array of API key strings (e.g., ["rk_abc123...", "rk_def456..."])
 */
export function getAllApiKeysFromEnv(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const bankKeys = JSON.parse(process.env.NEXT_PUBLIC_BANK_KEYS || "{}");
    // Extract all API key values from the object
    return Object.values(bankKeys).filter((key): key is string => 
      typeof key === "string"
    );
  } catch (error) {
    console.error("Error parsing bank keys:", error);
    return [];
  }
}


/**
 * Get ENV key name from workspace/organization name
 * Falls back to uppercase version of the name if no mapping exists
 */
export function getEnvKeyFromWorkspaceName(name: string): string {
  // First check explicit mapping
  if (WORKSPACE_NAME_TO_ENV_KEY[name]) {
    return WORKSPACE_NAME_TO_ENV_KEY[name];
  }

  // Fallback: try to match by converting name to uppercase and removing spaces
  const normalizedName = name.toUpperCase().replace(/\s+/g, "");

  // Check if normalized name exists in ENV keys
  if (typeof window !== "undefined") {
    try {
      const bankKeys = JSON.parse(process.env.NEXT_PUBLIC_BANK_KEYS || "{}");
      if (bankKeys[normalizedName]) {
        return normalizedName;
      }
    } catch (e) {
      console.error("Error parsing bank keys:", e);
    }
  }

  // Return normalized name as fallback
  return normalizedName;
}

/**
 * Get bank configuration (API key + static config like quickQuestions, primaryColor)
 * Supports both old format (string API key) and new format (object with config)
 */
function getBankConfig(bankKey: string): {
  apiKey: string | null;
  quickQuestions?: string[];
  primaryColor?: string;
  [key: string]: any;
} {
  if (typeof window === "undefined") return { apiKey: null };

  try {
    const bankKeys = JSON.parse(process.env.NEXT_PUBLIC_BANK_KEYS || "{}");
    const config = bankKeys[bankKey];

    if (!config) return { apiKey: null };

    // Old format: string API key
    if (typeof config === "string") {
      return { apiKey: config };
    }

    // New format: object with apiKey and other config
    if (typeof config === "object") {
      return {
        apiKey: config.apiKey || null,
        quickQuestions: config.quickQuestions,
        primaryColor: config.primaryColor,
        ...config, // Spread all other properties
      };
    }

    return { apiKey: null };
  } catch (error) {
    console.error("Error parsing bank config:", error);
    return { apiKey: null };
  }
}

/**
 * Hardcoded bank configurations (quickQuestions, primaryColor, etc.)
 * These are defined in code, not in ENV
 */
const BANK_CONFIGS: Record<
  string,
  {
    quickQuestions?: string[];
    primaryColor?: string;
    [key: string]: any;
  }
> = {
  NABIL: {
    quickQuestions: [
      "What is the capital of Nepal?",
      "What is the population of Nepal?",
    ],
    primaryColor: "#fefefe",
  },
};

/**
 * Get hardcoded bank config by name
 */
function getHardcodedBankConfig(bankName: string): {
  quickQuestions?: string[];
  primaryColor?: string;
  [key: string]: any;
} {
  // Try exact match first
  if (BANK_CONFIGS[bankName]) {
    return BANK_CONFIGS[bankName];
  }

  // Try matching by normalized name
  const normalizedName = bankName.toUpperCase().replace(/\s+/g, "");
  if (BANK_CONFIGS[normalizedName]) {
    return BANK_CONFIGS[normalizedName];
  }

  return {};
}

/**
 * Match workspace name to bank config name
 * Handles cases like "Nabil Bank" matching "NABIL"
 */
function matchWorkspaceToBankName(
  workspaceName: string,
  bankName: string,
): boolean {
  // Normalize both names: uppercase and remove spaces
  const normalizedWorkspace = workspaceName.toUpperCase().replace(/\s+/g, "");
  const normalizedBank = bankName.toUpperCase().replace(/\s+/g, "");

  // Check if normalized names match
  if (normalizedWorkspace === normalizedBank) {
    return true;
  }

  // Check if workspace name contains bank name (e.g., "Nabil Bank" contains "NABIL")
  if (normalizedWorkspace.includes(normalizedBank)) {
    return true;
  }

  // Check if bank name contains workspace name
  if (normalizedBank.includes(normalizedWorkspace)) {
    return true;
  }

  return false;
}

/**
 * Get bank config from banksData array by matching workspace name
 */
function getBankConfigFromArray(
  workspaceName: string,
  bankConfigs: Array<{
    name: string;
    quickQuestions?: string[];
    primaryColor?: string;
    [key: string]: any;
  }>,
): {
  quickQuestions?: string[];
  primaryColor?: string;
  [key: string]: any;
} | null {
  for (const bank of bankConfigs) {
    if (matchWorkspaceToBankName(workspaceName, bank.name)) {
      return bank;
    }
  }
  return null;
}

/**
 * Enriches organization data with API keys from ENV and hardcoded bank config
 * Matches workspace names to ENV keys and adds apiKey, quickQuestions, primaryColor, etc. to each workspace
 */
export function enrichOrganizationsWithApiKeys<
  T extends {
    workspaces?: Array<{ name: string; [key: string]: any }>;
    name?: string;
    [key: string]: any;
  },
>(
  organizations: T[],
  bankConfigs?: Array<{
    name: string;
    quickQuestions?: string[];
    primaryColor?: string;
    [key: string]: any;
  }>,
): T[] {
  if (typeof window === "undefined") return organizations;

  try {
    console.log(
      "bankKeys ==>",
      JSON.parse(process.env.NEXT_PUBLIC_BANK_KEYS || "{}"),
    );
    console.log("bankConfigs ==>", bankConfigs);

    return organizations.map((org) => {
      // If organization has workspaces array
      if (org.workspaces && Array.isArray(org.workspaces)) {
        const enrichedWorkspaces = org.workspaces.map((workspace) => {
          const envKey = getEnvKeyFromWorkspaceName(workspace.name);
          const envBankConfig = getBankConfig(envKey); // API key and config from ENV

          // Get hardcoded config from bankConfigs array (matching by name)
          let hardcodedConfig: {
            quickQuestions?: string[];
            primaryColor?: string;
            [key: string]: any;
          } = {};

          if (bankConfigs && Array.isArray(bankConfigs)) {
            const matchedBank = getBankConfigFromArray(
              workspace.name,
              bankConfigs,
            );
            if (matchedBank) {
              // Extract only quickQuestions and primaryColor, exclude name
              const { name, ...config } = matchedBank;
              hardcodedConfig = config;
            }
          }

          // Fallback to static BANK_CONFIGS if not found in array
          if (
            !hardcodedConfig.quickQuestions &&
            !hardcodedConfig.primaryColor
          ) {
            hardcodedConfig = getHardcodedBankConfig(workspace.name);
          }

          console.log(`Enriching workspace "${workspace.name}":`, {
            envKey,
            apiKey: envBankConfig.apiKey,
            hardcodedConfig,
          });

          // Merge: workspace data + ENV config (apiKey) + hardcoded config (quickQuestions, primaryColor)
          return {
            ...workspace,
            apiKey: envBankConfig.apiKey || null, // From ENV
            bankCode: envKey, // ENV_KEY (e.g., "NABIL", "GIME")
            ...hardcodedConfig, // quickQuestions, primaryColor from hardcoded config
          };
        });

        return {
          ...org,
          workspaces: enrichedWorkspaces,
        };
      }

      // If organization itself needs config (no workspaces)
      if (org.name) {
        const envKey = getEnvKeyFromWorkspaceName(org.name);
        const envBankConfig = getBankConfig(envKey);

        let hardcodedConfig: {
          quickQuestions?: string[];
          primaryColor?: string;
          [key: string]: any;
        } = {};

        if (bankConfigs && Array.isArray(bankConfigs)) {
          const matchedBank = getBankConfigFromArray(org.name, bankConfigs);
          if (matchedBank) {
            const { name, ...config } = matchedBank;
            hardcodedConfig = config;
          }
        }

        if (!hardcodedConfig.quickQuestions && !hardcodedConfig.primaryColor) {
          hardcodedConfig = getHardcodedBankConfig(org.name);
        }

        return {
          ...org,
          apiKey: envBankConfig.apiKey || null,
          bankCode: envKey,
          ...hardcodedConfig,
        };
      }

      console.log("return org", org);

      return org;
    });
  } catch (error) {
    console.error("Error enriching organizations with API keys:", error);
    return organizations;
  }
}

/**
 * Get API key for a specific workspace by name
 * Useful for direct API key lookup
 */
export function getApiKeyForWorkspace(workspaceName: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    const envKey = getEnvKeyFromWorkspaceName(workspaceName);
    return getBankApiKey(envKey);
  } catch (error) {
    console.error("Error getting API key for workspace:", error);
    return null;
  }
}

/**
 * Enriches banks array with API keys from ENV
 * Takes an array of bank objects (with quickQuestions, primaryColor, etc. already set)
 * and adds API keys from ENV while preserving existing properties
 */
export function enrichBanksWithApiKeys<
  T extends {
    name: string;
    [key: string]: any;
  },
>(banks: T[]): T[] {
  if (typeof window === "undefined") return banks;

  try {
    return banks.map((bank) => {
      // Get the ENV key from bank name (e.g., "NABIL" -> "NABIL" or "Nabil Bank" -> "NABIL")
      const envKey = getEnvKeyFromWorkspaceName(bank.name);
      const bankConfig = getBankConfig(envKey);

      // Only add API key from ENV, preserve all existing properties (quickQuestions, primaryColor, etc.)
      return {
        ...bank,
        apiKey: bankConfig.apiKey || null, // Only add API key, don't override other properties
      };
    });
  } catch (error) {
    console.error("Error enriching banks with API keys:", error);
    return banks;
  }
}

/**
 * Enriches banks array with config from ENV
 * Takes an array of bank objects (with name or minimal data) and enriches them with
 * quickQuestions, primaryColor, apiKey, and any other config from ENV
 * Note: This will override existing properties with ENV values
 */
export function enrichBanksWithConfig<
  T extends {
    name: string;
    [key: string]: any;
  },
>(banks: T[]): T[] {
  if (typeof window === "undefined") return banks;

  try {
    return banks.map((bank) => {
      // Get the ENV key from bank name (e.g., "NABIL" -> "NABIL" or "Nabil Bank" -> "NABIL")
      const envKey = getEnvKeyFromWorkspaceName(bank.name);
      const bankConfig = getBankConfig(envKey);

      // Merge bank data with config from ENV
      // Config from ENV will override any existing properties
      return {
        ...bank,
        ...bankConfig, // This includes apiKey, quickQuestions, primaryColor, and any other config
      };
    });
  } catch (error) {
    console.error("Error enriching banks with config:", error);
    return banks;
  }
}

/** Utils For Demo Chat Bot End**/
