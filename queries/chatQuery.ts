"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
    score?: number;
  }>;
  confidence?: number;
  processingTime?: number;
}

export interface ChatQueryRequest {
  query: string;
  maxSources?: number;
  scoreThreshold?: number;
  includeMetadata?: boolean;
  temperature?: number;
}

export interface ChatQueryResponse {
  answer: string;
  sources: Array<{
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
    score?: number;
  }>;
  sessionId?: string;
  confidence?: number;
  processingTime?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API!;

// Function to send a chat query to the RAG API
async function sendChatQuery(request: ChatQueryRequest): Promise<ChatQueryResponse> {
  const token = getAuthToken();
  const tenantId = localStorage.getItem("tenantId");

  if (!token) {
    throw new Error("No authentication token found");
  }

  if (!tenantId) {
    throw new Error("No tenant ID found");
  }

  const response = await fetch(`${BASE_URL}/api/v1/rag/query`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-tenant-id": tenantId,
      access_token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // The API now returns data in a nested format: { data: { answer, sources, confidence, processingTime } }
  const responseData = data.data || data; // Support both formats for backward compatibility

  // Transform the response to match our interface
  return {
    answer: responseData.answer || responseData.response || "No response received",
    sources: responseData.sources || [],
    sessionId: responseData.sessionId,
    confidence: responseData.confidence,
    processingTime: responseData.processingTime,
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
