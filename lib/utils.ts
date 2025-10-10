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
