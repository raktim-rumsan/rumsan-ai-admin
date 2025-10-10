import { createClient } from "@/lib/supabase/server";
import { generateRandomPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const supabase = await createClient();

    // Generate a random password
    const randomPassword = generateRandomPassword();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: randomPassword,
    });

    if (error) {
      // Check if the error is due to user already existing
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists")
      ) {
        return NextResponse.json(
          { error: "User is already registered with this email" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user,
      message: "User created with random password",
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
