import { ROUTES } from "@/constants";
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
      const { user } = data;
      const orgRegisterPayload = {
        email: user.email,
        id: user.id, // fallback if no id returned
      };
      const registerRes = await fetch(ROUTES.AUTH_REGISTER, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgRegisterPayload),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok)
        throw new Error(
          registerData.error || "Organization registration failed"
        );
      if (registerData?.data?.slug) {
        localStorage.setItem("tenantId", registerData.data.slug);
      }
      return { ...data };
    },
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; otpCode: string }) => {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      return data;
    },
  });
}
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (payload: { tokenHash: string }) => {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Email verification failed");

      return data;
    },
  });
}
export function useResendVerificationEmailMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Resend verification email failed");

      return data;
    },
  });
}
