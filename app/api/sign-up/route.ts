import { mapSupabaseAuthError } from "@/lib/supabase/auth-error-mapper";
import { createClient } from "@/lib/supabase/server";
import { generateRandomPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();
    const supabase = await createClient();

    // Generate a random password
    const randomPassword = generateRandomPassword();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: randomPassword,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      // Check if the error is due to user already existing
      const mappedError = mapSupabaseAuthError(error);
      return NextResponse.json(
        { error: mappedError.message, code: mappedError.code },
        { status: mappedError.status },
      );
    }

    return NextResponse.json({
      user: data.user,
      message: "User created with random password",
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
