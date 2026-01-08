"use client"

import { useState } from "react"
import {
  Book,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Landmark,
  Users,
  DollarSign,
  Send,
  Loader2,
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function HelpPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to SaintSal™ Partner Support! I'm here to help you succeed. Ask me anything about:\n\n• Real estate deals & the 70% rule\n• Investment analysis & trading\n• Lending products & referrals\n• Affiliate commissions & payouts\n• Client questions & objections\n\nHow can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "How do I explain the 70% rule to clients?",
    "What loan products can I offer?",
    "How do commissions work?",
    "Help me analyze a wholesale deal",
    "What's the difference between Partner and VP tiers?",
  ]

  const resources = [
    {
      title: "Partner Training Academy",
      description: "Complete video course on selling SaintSal™ products",
      icon: Video,
      link: "#",
      color: "blue",
    },
    {
      title: "Product Knowledge Base",
      description: "Detailed guides on all CookinCapital™ offerings",
      icon: Book,
      link: "#",
      color: "purple",
    },
    {
      title: "Marketing Materials",
      description: "Banners, scripts, and social media templates",
      icon: FileText,
      link: "#",
      color: "green",
    },
    {
      title: "Commission Calculator",
      description: "Calculate earnings across all products",
      icon: DollarSign,
      link: "/dashboard/affiliates",
      color: "amber",
    },
  ]

  const platforms = [
    {
      name: "CookinCapital.com",
      description: "Commercial & residential lending",
      icon: Landmark,
      link: "https://cookincapital.com",
      commission: "15% of origination",
    },
    {
      name: "CookinFlips.com",
      description: "Real estate investments",
      icon: Building2,
      link: "https://cookinflips.com",
      commission: "15-25% recurring",
    },
    {
      name: "CookinPartners.com",
      description: "Affiliate program portal",
      icon: Users,
      link: "https://cookinpartners.com",
      commission: "15-25% recurring",
    },
    {
      name: "SaintSal.ai",
      description: "AI-powered decision platform",
      icon: Sparkles,
      link: "https://saintsal.ai",
      commission: "15-25% recurring",
    },
  ]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Simulate AI response with helpful partner info
    setTimeout(() => {
      let response = ""

      const lowerInput = userMessage.toLowerCase()

      if (lowerInput.includes("70%") || lowerInput.includes("mao") || lowerInput.includes("wholesale")) {
        response = `**The 70% Rule Explained**\n\nThe 70% rule is the gold standard for wholesale real estate:\n\n**Formula:** MAO = (ARV × 70%) - Repairs\n\n**Example:**\n• After Repair Value (ARV): $300,000\n• Estimated Repairs: $40,000\n• MAO = ($300,000 × 0.70) - $40,000\n• **MAO = $170,000**\n\nThis leaves room for:\n• Your assignment fee ($10-20K)\n• Buyer's profit margin\n• Unexpected costs\n\n**Pro Tip:** Use our Real Estate Deal Analyzer to quickly calculate MAO for your clients!`
      } else if (lowerInput.includes("commission") || lowerInput.includes("earn") || lowerInput.includes("paid")) {
        response = `**Commission Structure**\n\n**Partner Tier (15%)**\n• Instant approval via Rewardful\n• 90-day cookie duration\n• NET-15 payouts\n• Lifetime recurring on subscriptions\n\n**VP Partner Tier (25%)**\n• Application required\n• Social media verification needed\n• W-9/W-8 BEN documentation\n• Priority support\n\n**Lending Commissions (CookinCapital)**\n• 15% of origination fees\n• $250K loan = ~$750 commission\n• $1M loan = ~$3,000 commission\n\nTrack all earnings in your Rewardful dashboard!`
      } else if (lowerInput.includes("loan") || lowerInput.includes("lending") || lowerInput.includes("financing")) {
        response = `**CookinCapital™ Loan Products**\n\n**Fix & Flip**\n• Rates: 10-12%\n• Terms: 6-18 months\n• LTV: Up to 90%\n• Min: $75,000\n\n**Bridge Loans**\n• Rates: 9-11%\n• Terms: 12-24 months\n• LTV: Up to 80%\n• Min: $100,000\n\n**DSCR Rental**\n• Rates: 7-9%\n• Terms: 30 years\n• LTV: Up to 80%\n• Min: $100,000\n\n**Commercial**\n• Rates: 6-8%\n• Terms: 5-25 years\n• LTV: Up to 75%\n• Min: $500,000\n\nSend clients to **cookincapital.com/apply** and earn 15% of origination fees!`
      } else if (lowerInput.includes("partner") || lowerInput.includes("vp") || lowerInput.includes("tier")) {
        response = `**Partner vs VP Partner**\n\n**Partner (15%)**\n✓ Sign up instantly via Rewardful\n✓ No application required\n✓ Great for getting started\n✓ All the same tools & resources\n\n**VP Partner (25%)**\n✓ 67% higher commissions\n✓ Requires social media presence\n✓ Must submit tax docs (W-9/W-8)\n✓ Priority support access\n✓ Early access to new products\n\n**Upgrade Path:**\n1. Start as Partner (15%)\n2. Build referral track record\n3. Apply for VP with social proof\n4. Get approved for 25%\n\nApply for VP status in your Partner Portal!`
      } else {
        response = `Great question! Here's how I can help:\n\n**Real Estate:** Use our Deal Analyzer to calculate MAO using the 70% rule. Track your wholesale deals and help clients understand property values.\n\n**Investments:** Research stocks with our Trading tool. Get AI-powered analysis to help guide client conversations.\n\n**Lending:** Refer clients to CookinCapital.com/apply for fix & flip, bridge, DSCR, and commercial loans. Earn 15% of origination fees.\n\n**Commissions:** Track everything through your Rewardful dashboard. Partners earn 15%, VP Partners earn 25%.\n\nWould you like me to dive deeper into any of these areas?`
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Partner Help Center</h1>
          <p className="text-neutral-400">Get answers, training, and resources to maximize your success.</p>
        </div>
        <a
          href="https://cookinpartners.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-all"
        >
          CookinPartners Portal
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4a106]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#d4a106]" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  SaintSal<span className="text-white">™</span> Partner Assistant
                </h3>
                <p className="text-neutral-500 text-sm">AI-powered support for partners</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[#d4a106] text-black"
                        : "bg-neutral-800 text-white border border-neutral-700"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 text-white border border-neutral-700 p-4 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-[#d4a106]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            <div className="p-3 border-t border-neutral-800 flex gap-2 overflow-x-auto">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-xs rounded-full hover:bg-neutral-700 hover:text-white transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask SaintSal™ anything..."
                  className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106]"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-[#d4a106]" />
              Partner Resources
            </h3>
            <div className="space-y-3">
              {resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.link}
                  className="block p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${resource.color}-500/20 flex items-center justify-center`}>
                      <resource.icon className={`w-4 h-4 text-${resource.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{resource.title}</div>
                      <div className="text-neutral-500 text-xs">{resource.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-[#d4a106] transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#d4a106]" />
              Our Platforms
            </h3>
            <div className="space-y-3">
              {platforms.map((platform, i) => (
                <a
                  key={i}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#d4a106]/20 flex items-center justify-center">
                      <platform.icon className="w-4 h-4 text-[#d4a106]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium flex items-center gap-1">
                        {platform.name}
                        <ExternalLink className="w-3 h-3 text-neutral-600" />
                      </div>
                      <div className="text-neutral-500 text-xs">{platform.description}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-[#d4a106]">{platform.commission}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Apply */}
          <a
            href="https://cookincapital.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-2xl bg-gradient-to-br from-[#d4a106]/20 to-orange-500/10 border border-[#d4a106]/30 hover:border-[#d4a106]/50 transition-all"
          >
            <Landmark className="w-8 h-8 text-[#d4a106] mb-3" />
            <h3 className="font-bold text-white mb-1">Client Need Financing?</h3>
            <p className="text-neutral-400 text-sm mb-3">Send them to CookinCapital for fast approvals</p>
            <span className="text-[#d4a106] text-sm font-medium flex items-center gap-1">
              Apply Now <ChevronRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
