import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
  return match ? match[1] : null;
}

export function generateRandomPassword(length: number = 16): string {
  return randomBytes(length).toString("hex");
}

export function getWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("workspaceId");
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
