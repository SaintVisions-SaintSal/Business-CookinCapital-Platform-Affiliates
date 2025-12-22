import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { transferToAffiliate } from "@/lib/stripe"

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
    const { data: affiliate } = await supabase.from("affiliates").select("*").eq("user_id", user.id).single()

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 400 })
    }

    if (affiliate.pending_payout < 25) {
      return NextResponse.json({ error: "Minimum payout is $25" }, { status: 400 })
    }

    if (!affiliate.stripe_connect_id) {
      return NextResponse.json({ error: "Please connect your Stripe account first" }, { status: 400 })
    }

    // Process the transfer
    const transfer = await transferToAffiliate(
      affiliate.pending_payout,
      affiliate.stripe_connect_id,
      `SaintSal™ Affiliate Payout - ${new Date().toLocaleDateString()}`,
    )

    // Update database
    const { data: payoutId } = await supabase.rpc("process_affiliate_payout", {
      p_affiliate_id: affiliate.id,
      p_amount: affiliate.pending_payout,
      p_method: "stripe",
      p_stripe_transfer_id: transfer.id,
    })

    // Mark as completed
    await supabase.rpc("complete_payout", { p_payout_id: payoutId })

    return NextResponse.json({
      success: true,
      payout: {
        id: payoutId,
        amount: affiliate.pending_payout,
        transfer_id: transfer.id,
      },
    })
  } catch (error) {
    console.error("Payout error:", error)
    return NextResponse.json({ error: "Payout failed" }, { status: 500 })
  }
}
