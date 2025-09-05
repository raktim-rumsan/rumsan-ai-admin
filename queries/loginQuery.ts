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
      const {user} = data;
      // After successful sign up, register organization
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API!;
      // Use id from response if available, else fallback to email
      const orgRegisterPayload = {
        email: user.email,
        id: user.id, // fallback if no id returned
      };
      const registerRes = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgRegisterPayload),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok)
        throw new Error(registerData.error || "Organization registration failed");
      if (registerData?.data?.slug) {
        localStorage.setItem("tenantId", registerData.data.slug);
      }
      return { ...data};
    },
  });
}
