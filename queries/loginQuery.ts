import { useMutation } from "@tanstack/react-query";

export default function useLoginMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      return data;
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      // First, sign up the user
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      return { ...data };
    },
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      otpCode: string;
    }): Promise<{
      success: boolean;
      shouldRefetchContext?: boolean;
    }> => {
      // Verify the OTP
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      // Return success and indicate that organization context should be refetched
      // The OrganizationContextProvider will handle the actual fetching
      return {
        success: true,
        shouldRefetchContext: true,
      };
    },
  });
}
