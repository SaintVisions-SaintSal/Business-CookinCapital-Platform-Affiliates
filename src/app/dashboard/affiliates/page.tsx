"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  DollarSign,
  Copy,
  Check,
  TrendingUp,
  Share2,
  Gift,
  ChevronRight,
  Sparkles,
  Wallet,
  Crown,
  Target,
  Zap,
  Trophy,
  Star,
  ArrowRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatNumber, generateAffiliateCode, cn } from "@/lib/utils"
import { toast } from "sonner"

const COMMISSION_TIERS = [
  { plan: "Starter", price: 27, commission: 8.1, icon: Zap },
  { plan: "Pro", price: 97, commission: 29.1, icon: TrendingUp },
  { plan: "Teams", price: 297, commission: 89.1, icon: Users },
  { plan: "Enterprise", price: 497, commission: 149.1, icon: Crown },
]

export default function AffiliatesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [affiliate, setAffiliate] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const supabase = createClient()

  const affiliateLink = affiliate?.affiliate_code
    ? `https://cookinbiz.com/signup?ref=${affiliate.affiliate_code}`
    : null

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profile)

      // Get affiliate info
      const { data: affiliate } = await supabase.from("affiliates").select("*").eq("user_id", user.id).single()
      setAffiliate(affiliate)

      if (affiliate) {
        // Get referrals
        const { data: referrals } = await supabase
          .from("profiles")
          .select("id, full_name, email, tier, created_at")
          .eq("referred_by", affiliate.affiliate_code)
          .order("created_at", { ascending: false })
          .limit(10)
        setReferrals(referrals || [])

        // Get commissions
        const { data: commissions } = await supabase
          .from("commissions")
          .select("*")
          .eq("affiliate_id", affiliate.id)
          .order("created_at", { ascending: false })
          .limit(10)
        setCommissions(commissions || [])
      }
    }
    loadData()
  }, [supabase])

  const handleJoinProgram = async () => {
    if (!profile) return
    setIsJoining(true)

    try {
      const code = generateAffiliateCode(profile.full_name || profile.email)

      const { data, error } = await supabase
        .from("affiliates")
        .insert({
          user_id: profile.id,
          affiliate_code: code,
          tier: "jr",
          commission_rate: 0.3, // 30%
          status: "active",
        })
        .select()
        .single()

      if (error) throw error

      setAffiliate(data)
      toast.success("Welcome to the affiliate program!")
    } catch (error) {
      toast.error("Failed to join. Please try again.")
    } finally {
      setIsJoining(false)
    }
  }

  const copyLink = () => {
    if (!affiliateLink) return
    navigator.clipboard.writeText(affiliateLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Link copied!")
  }

  if (!affiliate) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          className="glass-card p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]" />

          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-gold-500/30 to-gold-600/30 flex items-center justify-center mb-8 border border-gold-500/20">
              <Trophy className="w-12 h-12 text-gold-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
              <Star className="w-4 h-4" />
              Top Affiliates Earn $10K+/Month
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              Earn <span className="text-gold-gradient">30% Recurring</span> Commissions
            </h1>

            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Share SaintSal™ and earn on every subscription, every month, for as long as they stay. Same-day payouts
              via Stripe Connect.
            </p>

            {/* Main Stats */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              {[
                { value: "30%", label: "Recurring Commission", sub: "Every month, forever" },
                { value: "Same-Day", label: "Instant Payouts", sub: "Via Stripe Connect" },
                { value: "+15%", label: "VP Override", sub: "On your team's sales" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-3xl font-bold text-gold-gradient mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-white/40">{stat.sub}</div>
                </div>
              ))}
            </div>

            <button onClick={handleJoinProgram} disabled={isJoining} className="btn-gold text-xl px-12 py-5">
              {isJoining ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-2" />
                  Join the Affiliate Program Now
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Commission Breakdown */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Commission Breakdown</h2>
            <p className="text-white/50">Earn on every plan, every month</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMISSION_TIERS.map((tier, i) => (
              <motion.div
                key={tier.plan}
                className={cn(
                  "p-6 rounded-2xl border transition-all hover:scale-105",
                  tier.plan === "Enterprise"
                    ? "bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/30"
                    : "bg-white/[0.02] border-white/[0.08]",
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <tier.icon
                  className={cn("w-8 h-8 mb-4", tier.plan === "Enterprise" ? "text-purple-400" : "text-gold-400")}
                />
                <div className="text-lg font-semibold text-white mb-1">{tier.plan}</div>
                <div className="text-sm text-white/40 mb-3">${tier.price}/mo subscription</div>
                <div
                  className={cn(
                    "text-3xl font-bold mb-1",
                    tier.plan === "Enterprise"
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                      : "text-gold-gradient",
                  )}
                >
                  ${tier.commission.toFixed(2)}
                </div>
                <div className="text-xs text-green-400">per month, recurring</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-center">
            <p className="text-gold-400">
              <strong>Example:</strong> Refer just 10 Enterprise customers ={" "}
              <strong className="text-white">$1,491/month passive income</strong>
            </p>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-white/50">Start earning in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Get Your Link",
                desc: "Join the program and get your unique affiliate link instantly",
                icon: Gift,
              },
              {
                step: "2",
                title: "Share & Promote",
                desc: "Share with your network, social media, email list, or content",
                icon: Share2,
              },
              {
                step: "3",
                title: "Earn Commissions",
                desc: "30% recurring on every subscription, paid same-day via Stripe",
                icon: DollarSign,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-gold-400" />
                </div>
                <div className="text-sm text-gold-400 font-bold mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VP Program Teaser */}
        <motion.div
          className="glass-card p-8 relative overflow-hidden border-gold-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-10 h-10 text-gold-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Become a VP Partner</h3>
              <p className="text-white/60">
                Top affiliates can apply to become VP Partners and earn an{" "}
                <strong className="text-gold-400">additional 15% override</strong> on their entire team's commissions.
                Build a network, train your team, and scale your income to $50K+/month.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Affiliate Dashboard
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Dashboard</h1>
          <p className="text-white/50 mt-1">Track your earnings and grow your network</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2",
              affiliate.tier === "vp"
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "bg-white/10 text-white/60",
            )}
          >
            {affiliate.tier === "vp" ? <Crown className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            {affiliate.tier === "vp" ? "VP Partner" : "Junior Affiliate"}
          </span>
        </div>
      </div>

      {/* Affiliate Link Card */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white/50 mb-2">Your Affiliate Link</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 font-mono text-sm truncate">
                {affiliateLink}
              </div>
              <button
                onClick={copyLink}
                className="p-3 rounded-xl bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button className="p-3 rounded-xl bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-8 lg:pl-6 lg:border-l lg:border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-gradient">
                {Math.round(affiliate.commission_rate * 100)}%
              </div>
              <div className="text-sm text-white/50">Commission</div>
            </div>
            {affiliate.tier === "vp" && (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">+15%</div>
                <div className="text-sm text-white/50">Override</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Earnings",
            value: formatCurrency(affiliate.total_earnings || 0),
            icon: DollarSign,
            change: "+23%",
            color: "gold",
          },
          {
            label: "Pending Payout",
            value: formatCurrency(affiliate.pending_payout || 0),
            icon: Wallet,
            action: "Request Payout",
            color: "green",
          },
          {
            label: "Total Referrals",
            value: formatNumber(referrals.length),
            icon: Users,
            change: "+5",
            color: "blue",
          },
          {
            label: "Conversion Rate",
            value: "32%",
            icon: TrendingUp,
            change: "+2.4%",
            color: "purple",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              {stat.change && (
                <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
              {stat.action && (
                <button className="text-xs font-medium text-gold-400 hover:text-gold-300 bg-gold-500/10 px-3 py-1 rounded-full">
                  {stat.action}
                </button>
              )}
            </div>
            <div className="text-3xl font-bold text-gold-gradient mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Commission Calculator */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold text-white mb-4">Potential Monthly Earnings</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMISSION_TIERS.map((tier, i) => (
            <div key={tier.plan} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <tier.icon className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-medium text-white">{tier.plan}</span>
              </div>
              <div className="text-2xl font-bold text-gold-gradient">${tier.commission.toFixed(2)}</div>
              <div className="text-xs text-white/40">per referral/month</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Referrals</h3>
            <Link href="/dashboard/affiliates/referrals" className="text-sm text-gold-400 hover:text-gold-300">
              View all
            </Link>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No referrals yet</p>
              <p className="text-sm text-white/30 mt-1">Share your link to start earning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
                      {referral.full_name?.charAt(0) || referral.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{referral.full_name || "New User"}</div>
                      <div className="text-xs text-white/40">{referral.tier} plan</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">Active</div>
                    <div className="text-xs text-white/40">{new Date(referral.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Commissions */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Commissions</h3>
            <Link href="/dashboard/affiliates/commissions" className="text-sm text-gold-400 hover:text-gold-300">
              View all
            </Link>
          </div>

          {commissions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No commissions yet</p>
              <p className="text-sm text-white/30 mt-1">Commissions appear when referrals subscribe</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commissions.map((commission, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        commission.status === "paid" ? "bg-green-500/20" : "bg-gold-500/20"
                      }`}
                    >
                      <DollarSign
                        className={`w-5 h-5 ${commission.status === "paid" ? "text-green-400" : "text-gold-400"}`}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {commission.type === "direct" ? "Direct Commission" : "Override Commission"}
                      </div>
                      <div className="text-xs text-white/40">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gold-gradient">+{formatCurrency(commission.amount)}</div>
                    <div className={`text-xs ${commission.status === "paid" ? "text-green-400" : "text-gold-400"}`}>
                      {commission.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* VP Upgrade CTA */}
      {affiliate.tier === "jr" && (
        <motion.div
          className="glass-card p-8 relative overflow-hidden border-gold-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px]" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                <Crown className="w-10 h-10 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">Become a VP Partner</h3>
                  <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-bold rounded-full">
                    +15% Override
                  </span>
                </div>
                <p className="text-white/50 max-w-lg">
                  Earn 15% override on your entire team's commissions. Build a network of affiliates. Top VPs earn
                  $50K+/month in passive income.
                </p>
              </div>
            </div>
            <Link href="/dashboard/affiliates/vp-application" className="btn-gold whitespace-nowrap text-lg px-8 py-4">
              Apply Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
