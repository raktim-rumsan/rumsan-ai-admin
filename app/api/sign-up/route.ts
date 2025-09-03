import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
  try {
    const { email, password, organizationName } = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        data: {
          organization_name: organizationName.trim(),
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}