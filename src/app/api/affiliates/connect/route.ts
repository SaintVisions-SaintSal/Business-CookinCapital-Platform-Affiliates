import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createConnectAccount, createAccountLink } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get affiliate info
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("*, profiles!inner(email)")
      .eq("user_id", user.id)
      .single()

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 400 })
    }

    let accountId = affiliate.stripe_connect_id

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await createConnectAccount((affiliate as any).profiles.email)
      accountId = account.id

      // Save to database
      await supabase.from("affiliates").update({ stripe_connect_id: accountId }).eq("id", affiliate.id)
    }

    // Create onboarding link
    const origin = req.headers.get("origin") || "https://cookinbiz.com"
    const accountLink = await createAccountLink(
      accountId,
      `${origin}/dashboard/affiliates?refresh=true`,
      `${origin}/dashboard/affiliates?success=true`,
    )

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Connect error:", error)
    return NextResponse.json({ error: "Failed to create connect account" }, { status: 500 })
  }
}
