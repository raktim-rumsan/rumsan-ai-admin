"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";

import { ROUTES } from "@/constants";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{
    id: number;
    score: number;
    payload: {
      documentId: string;
      chunk: string;
      fileName: string;
    };
  }>;
  confidence?: number;
  processingTime?: number;
}

export interface ChatQueryRequest {
  query: string;
}

export interface ChatQueryResponse {
  answer: string;
  confidence?: number;
  processingTime?: number;
  sources?: Array<{
    id: number;
    score: number;
    payload: {
      documentId: string;
      chunk: string;
      fileName: string;
    };
  }>;
}

// Function to send a chat query to the RAG API
async function sendChatQuery(
  request: ChatQueryRequest
): Promise<ChatQueryResponse> {
  const token = getAuthToken();
  const workspaceId = localStorage.getItem("workspaceId");

  if (!token) {
    throw new Error("No authentication token found");
  }

  if (!workspaceId) {
    throw new Error("No tenant ID found");
  }

  const response = await fetch(ROUTES.QUERY, {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-tenant-id": workspaceId,
      access_token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message ||
      errorData.error ||
      `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  const responseData: ChatQueryResponse = data.data || data;
  return {
    answer: responseData.answer || "No response received",
    confidence: responseData.confidence || 0,
    processingTime: responseData.processingTime || 0,
    sources: responseData.sources || [],
  };
}

// Mutation hook for sending chat messages
export function useChatMutation() {
  return useMutation({
    mutationFn: sendChatQuery,
    onError: (error: Error) => {
      console.error("Chat query error:", error);
    },
  });
}

// Function to get chat history (mock implementation for now)
async function getChatHistory(): Promise<ChatMessage[]> {
  // In a real implementation, this would fetch from a backend
  // For now, we'll return from localStorage
  const stored = localStorage.getItem("chatHistory");
  if (!stored) return [];

  try {
    const history = JSON.parse(stored) as ChatMessage[];
    return history.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch {
    return [];
  }
}

// Function to save chat history
export function saveChatHistory(messages: ChatMessage[]) {
  localStorage.setItem("chatHistory", JSON.stringify(messages));
}

// Query hook for chat history
export function useChatHistory() {
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const ragHealthTest = async () => {
  try {
    const testEndpoint = ROUTES.RAG_HEALTH;
    const response = await fetch(testEndpoint, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });

    if (response.ok) {
      return "connected";
    } else {
      console.warn("API connection test failed:", response.status);
      return "failed";
    }
  } catch (error) {
    console.error("API connection test error:", error);
    return "failed";
  }
};

export async function sendWidgetChatQuery(
  query: string,
  apiKey: string,
  workspaceId: string
): Promise<{ answer: string }> {

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(ROUTES.QUERY_WITH_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": workspaceId,
        "x-api-key": apiKey,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
      mode: "cors",
      credentials: "omit",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      answer: data.answer || data.data?.answer || "No response received",
    };
  } catch (error) {
    console.error("Fetch error details:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout: The server took too long to respond.");
      }
      if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
        throw new Error(
          "Request blocked: Please disable ad blockers or try a different browser."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Network error: Unable to connect to the API server. Please check if the server is running and accessible."
        );
      }
    }
    throw error;
  }
}

async function sendChatQueryIndustry(
  request: ChatQueryRequest
): Promise<ChatQueryResponse> {
    const sector = process.env.NEXT_PUBLIC_DEFAULT_INDUSTRY;
    const url = `${ROUTES.SECTOR_QUERY}?sector=${encodeURIComponent(sector || "")}`;
  

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message ||
      errorData.error ||
      `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  const responseData: ChatQueryResponse = data.data || data;
  return {
    answer: responseData.answer || "No response received",
    confidence: responseData.confidence || 0,
    processingTime: responseData.processingTime || 0,
    sources: responseData.sources || [],
  };
}

// Mutation hook for sending chat messages
export function useChatIndustryMutation() {
  return useMutation({
    mutationFn: sendChatQueryIndustry,
    onError: (error: Error) => {
      console.error("Chat query error:", error);
    },
  });
}