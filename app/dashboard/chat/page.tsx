"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, ExternalLink } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const showcaseResponses: Record<string, string> = {
  default:
    "Thanks for your interest in SaintSal™ AI! This is a showcase demo. For the full AI experience with real-time business insights, visit our production platform at SaintSal.com. The complete AI advisor will help you with real estate investing, trading strategies, and business growth.",
  wholesale:
    "Great question about wholesale deals! The 70% Rule is fundamental: Maximum Purchase Price = (ARV × 70%) - Repair Costs. For example, if a property's ARV is $200K and needs $30K in repairs, your max offer is $110K. Visit CookinFlips.com for our full deal analyzer powered by SaintSal™ AI.",
  "70%":
    "The 70% Rule helps wholesalers calculate maximum allowable offer (MAO). Formula: MAO = (ARV × 0.70) - Repairs. This ensures profit margins for both you and your end buyer. Our CookinCapital.com platform has advanced calculators for precise deal analysis.",
  passive:
    "Building passive income requires multiple streams: real estate rentals, dividend stocks, affiliate marketing, and digital products. SaintSal™ helps you analyze opportunities across all these. Join CookinPartners.com to earn commissions while building your wealth!",
  affiliate:
    "Affiliate marketing with SaintSal™ offers 30% recurring commissions on all referrals. Our ecosystem includes CookinCapital (lending), CookinFlips (investing), and CookinPartners (affiliates). Start earning at CookinPartners.com!",
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("wholesale") || lower.includes("deal")) return showcaseResponses.wholesale
  if (lower.includes("70%") || lower.includes("rule")) return showcaseResponses["70%"]
  if (lower.includes("passive") || lower.includes("income")) return showcaseResponses.passive
  if (lower.includes("affiliate") || lower.includes("commission")) return showcaseResponses.affiliate
  return showcaseResponses.default
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm SaintSal™ AI, your business advisor. This is a showcase demo of our AI capabilities. Ask me anything about real estate investing, the 70% rule, passive income, or affiliate marketing!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = getResponse(userMessage)
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setIsLoading(false)
  }

  const suggestedPrompts = [
    "How do I analyze a wholesale deal?",
    "What's the 70% rule in real estate?",
    "How to build passive income?",
    "Best strategies for affiliate marketing",
  ]

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <Bot className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            SaintSal<span className="text-white">™</span> AI
          </h1>
          <p className="text-sm text-neutral-400">Your AI Business Advisor</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a
            href="https://saintsal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <span className="text-xs text-amber-400">Full AI Experience</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Demo Mode</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, i) => (
          <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-black" />
              </div>
            )}
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-[#d4a106] text-black rounded-br-sm"
                  : "bg-neutral-800 text-white rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div className="bg-neutral-800 p-4 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-neutral-400">Try these questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask SaintSal™ anything..."
          className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106] focus:ring-1 focus:ring-[#d4a106]/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-[#d4a106] hover:bg-[#b8910a] disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
