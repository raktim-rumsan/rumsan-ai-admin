import { AuthError } from "@supabase/supabase-js";

export function mapSupabaseAuthError(error: AuthError) {
  const message = error.message.toLowerCase();
  if (
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return {
      status: 409,
      message: "User is already registered with this email",
      code: "USER_ALREADY_EXISTS",
    };
  }

  if (message.includes("signups not allowed for otp")) {
    return {
      status: 400,
      message: "This email is not registered. Please contact support.",
      code: "EMAIL_NOT_REGISTERED",
    };
  }
  return {
    status: 400,
    message: "Unable to send login code. Please try again.",
    code: "AUTH_FAILED",
  };
}
