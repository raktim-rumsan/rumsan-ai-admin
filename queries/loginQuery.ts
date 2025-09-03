import { useMutation } from "@tanstack/react-query"

export default function useLoginMutation() {
  return useMutation({
    mutationFn: async (email:string) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Login failed")
      return data
    },
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; organizationName: string }) => {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Sign up failed")
      return data
    },
  })
}

