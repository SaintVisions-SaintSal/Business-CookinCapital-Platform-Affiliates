"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Home,
  Sparkles,
  MapPin,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Star,
  Clock,
  Building2,
  Calculator,
  Brain,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, cn } from "@/lib/utils"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recentScores, setRecentScores] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const loadScores = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .not("ai_score", "is", null)
        .order("created_at", { ascending: false })
        .limit(10)

      setRecentScores(data || [])
    }
    loadScores()
  }, [supabase])

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return
    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  // Mock recent analyses
  const mockScores = [
    {
      address: "123 Main St",
      city: "Houston",
      state: "TX",
      ai_score: 92,
      arv: 285000,
      mao: 185250,
      created_at: new Date().toISOString(),
    },
    {
      address: "456 Oak Ave",
      city: "Dallas",
      state: "TX",
      ai_score: 78,
      arv: 320000,
      mao: 208000,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      address: "789 Pine Rd",
      city: "Austin",
      state: "TX",
      ai_score: 85,
      arv: 410000,
      mao: 266500,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  const displayScores = recentScores.length > 0 ? recentScores : mockScores

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Property Scoring</h1>
          <p className="text-white/50 mt-1">AI-powered property analysis and investment scores</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Property Analyzer</h2>
              <p className="text-sm text-white/50">Get instant investment scores powered by SaintSal AI</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Enter property address (e.g., 123 Main St, Houston, TX 77001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="input-premium pl-12 pr-32 w-full text-lg py-4"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !searchQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold !py-2.5 !px-6 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Analyze
                </div>
              )}
            </button>
          </div>

          {/* What you'll get */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "Investment Score", desc: "0-100 rating" },
              { icon: DollarSign, label: "ARV Estimate", desc: "After repair value" },
              { icon: Calculator, label: "MAO Calculator", desc: "Max allowable offer" },
              { icon: Building2, label: "Comp Analysis", desc: "Nearby sales data" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <item.icon className="w-6 h-6 text-gold-400 mb-2" />
                <div className="font-medium text-white">{item.label}</div>
                <div className="text-xs text-white/40">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
          <Link href="/dashboard/real-estate" className="text-sm text-gold-400 hover:text-gold-300">
            View All Properties
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayScores.map((score, i) => (
            <div key={i} className="glass-card p-6 hover:border-gold-500/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">{score.address}</h4>
                  <p className="text-sm text-white/50">
                    {score.city}, {score.state}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg",
                    score.ai_score >= 85
                      ? "bg-green-500/20 text-green-400"
                      : score.ai_score >= 70
                        ? "bg-gold-500/20 text-gold-400"
                        : "bg-red-500/20 text-red-400",
                  )}
                >
                  {score.ai_score}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-white/40">ARV</div>
                  <div className="font-semibold text-green-400">{formatCurrency(score.arv)}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40">MAO (70%)</div>
                  <div className="font-semibold text-gold-gradient">{formatCurrency(score.mao)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {new Date(score.created_at).toLocaleDateString()}
                </div>
                <button className="text-gold-400 hover:text-gold-300">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Usage Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Analyses This Month", value: "23", limit: "50", icon: Brain },
          { label: "Properties Saved", value: "47", icon: Home },
          { label: "Avg Score", value: "82", icon: Star },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6 text-gold-400" />
              {stat.limit && (
                <span className="text-xs text-white/40">
                  {stat.value}/{stat.limit}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gold-gradient">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Unlimited Property Scores</h3>
              <p className="text-white/50">Upgrade to Pro for unlimited analyses, comp reports, and AI insights.</p>
            </div>
          </div>
          <Link href="/dashboard/upgrade" className="btn-gold whitespace-nowrap">
            Upgrade to Pro
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
