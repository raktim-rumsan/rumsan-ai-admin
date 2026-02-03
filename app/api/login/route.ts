import { mapSupabaseAuthError } from "@/lib/supabase/auth-error-mapper";
import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      const mappedError = mapSupabaseAuthError(error);
      return NextResponse.json(
        { error: mappedError.message, code: mappedError.code },
        { status: mappedError.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error, "error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
