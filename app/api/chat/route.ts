import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Verify user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const result = streamText({
    model: "openai:gpt-4o",
    system: `You are SaintSal™, an elite AI business advisor powered by Saint Vision Technologies. You specialize in:

- Real Estate Investing (wholesaling, fix & flip, rental properties)
- Trading & Portfolio Management
- Business Intelligence & Strategy
- Affiliate Marketing & Passive Income
- Property Analysis (ARV, MAO, 70% rule, comps)

You provide actionable, high-value insights with confidence. You're direct, knowledgeable, and focused on helping users build wealth.`,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
