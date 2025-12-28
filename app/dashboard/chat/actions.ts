"use server"

import { generateText } from "ai"

export async function sendMessage(message: string): Promise<string> {
  const { text } = await generateText({
    model: "openai:gpt-4o",
    system: `You are SaintSal™, an elite AI business advisor specializing in real estate investing, trading, business intelligence, and wealth building. You provide actionable, high-value insights with confidence and expertise. You understand concepts like wholesaling, the 70% rule, ARV calculations, MAO formulas, affiliate marketing, and building passive income streams.`,
    prompt: message,
  })
  return text
}
