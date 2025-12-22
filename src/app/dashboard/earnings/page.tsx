"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, cn } from "@/lib/utils"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function EarningsPage() {
  const [affiliate, setAffiliate] = useState<any>(null)
  const [commissions, setCommissions] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month")
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: affiliateData } = await supabase.from("affiliates").select("*").eq("user_id", user.id).single()
      setAffiliate(affiliateData)

      if (affiliateData) {
        const { data: commissionsData } = await supabase
          .from("commissions")
          .select("*")
          .eq("affiliate_id", affiliateData.id)
          .order("created_at", { ascending: false })
        setCommissions(commissionsData || [])

        const { data: payoutsData } = await supabase
          .from("payouts")
          .select("*")
          .eq("affiliate_id", affiliateData.id)
          .order("created_at", { ascending: false })
        setPayouts(payoutsData || [])
      }
    }
    loadData()
  }, [supabase])

  // Mock data for display
  const totalEarnings = affiliate?.total_earnings || 12450
  const pendingPayout = affiliate?.pending_payout || 1830
  const thisMonthEarnings = 2340
  const lastMonthEarnings = 1980

  const monthlyData = [
    { month: "Jul", earnings: 1200 },
    { month: "Aug", earnings: 1450 },
    { month: "Sep", earnings: 1680 },
    { month: "Oct", earnings: 1890 },
    { month: "Nov", earnings: 1980 },
    { month: "Dec", earnings: 2340 },
  ]

  const recentTransactions = [
    { type: "commission", description: "Pro Plan - John D.", amount: 29.1, status: "paid", date: "Dec 18" },
    { type: "commission", description: "Teams Plan - Sarah M.", amount: 89.1, status: "paid", date: "Dec 17" },
    { type: "payout", description: "Stripe Payout", amount: -1500, status: "completed", date: "Dec 15" },
    { type: "commission", description: "Pro Plan - Mike R.", amount: 29.1, status: "pending", date: "Dec 14" },
    { type: "commission", description: "Starter Plan - Lisa K.", amount: 8.1, status: "paid", date: "Dec 12" },
    { type: "commission", description: "Override - Team Sales", amount: 145.35, status: "paid", date: "Dec 10" },
  ]

  const maxEarnings = Math.max(...monthlyData.map((d) => d.earnings))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Earnings</h1>
          <p className="text-white/50 mt-1">Track your affiliate commissions and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-gold flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Request Payout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Earnings",
            value: formatCurrency(totalEarnings),
            icon: DollarSign,
            change: "+23%",
            positive: true,
          },
          {
            label: "Pending Payout",
            value: formatCurrency(pendingPayout),
            icon: Clock,
            action: "Request",
          },
          {
            label: "This Month",
            value: formatCurrency(thisMonthEarnings),
            icon: Calendar,
            change: `+${(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100).toFixed(0)}%`,
            positive: true,
          },
          {
            label: "Avg Per Referral",
            value: formatCurrency(45.6),
            icon: TrendingUp,
            change: "+12%",
            positive: true,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              {stat.change && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    stat.positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400",
                  )}
                >
                  {stat.change}
                </span>
              )}
              {stat.action && (
                <button className="text-xs font-medium text-gold-400 hover:text-gold-300">{stat.action}</button>
              )}
            </div>
            <div className="text-3xl font-bold text-gold-gradient mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <motion.div className="lg:col-span-2 glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold-400" />
              Earnings Over Time
            </h3>
            <div className="flex rounded-lg bg-white/5 p-1">
              {(["week", "month", "year", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                    period === p ? "bg-gold-500/20 text-gold-400" : "text-white/50 hover:text-white",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end justify-between gap-4 h-48">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative">
                  <div
                    className="w-full bg-gold-500/20 rounded-t-lg transition-all duration-500 hover:bg-gold-500/30"
                    style={{ height: `${(data.earnings / maxEarnings) * 160}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white/60 opacity-0 group-hover:opacity-100">
                      {formatCurrency(data.earnings)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-white/40">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gold-400" />
              Commission Breakdown
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: "Pro Plan", value: 4850, percent: 45, color: "bg-gold-400" },
              { label: "Teams Plan", value: 3200, percent: 30, color: "bg-green-400" },
              { label: "Starter Plan", value: 1800, percent: 17, color: "bg-blue-400" },
              { label: "Overrides", value: 850, percent: 8, color: "bg-purple-400" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">{item.label}</span>
                  <span className="text-sm font-medium text-white">{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", item.color)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Total</span>
              <span className="text-lg font-bold text-gold-gradient">{formatCurrency(10700)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <button className="text-sm text-gold-400 hover:text-gold-300">View All</button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.amount > 0 ? "bg-green-500/10" : "bg-blue-500/10",
                  )}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{tx.description}</div>
                  <div className="text-xs text-white/40">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("font-semibold", tx.amount > 0 ? "text-green-400" : "text-blue-400")}>
                  {tx.amount > 0 ? "+" : ""}
                  {formatCurrency(Math.abs(tx.amount))}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    tx.status === "paid" || tx.status === "completed" ? "text-green-400" : "text-gold-400",
                  )}
                >
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payout Methods */}
      <motion.div
        className="glass-card p-6 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />

        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-6">Payout Methods</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { method: "Stripe Connect", icon: CreditCard, connected: true, default: true },
              { method: "PayPal", icon: Wallet, connected: false },
              { method: "Bank Transfer", icon: DollarSign, connected: false },
            ].map((pm, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-xl border transition-colors cursor-pointer",
                  pm.default
                    ? "bg-gold-500/10 border-gold-500/30"
                    : pm.connected
                      ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                      : "bg-white/[0.02] border-dashed border-white/10 hover:border-white/20",
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <pm.icon className={cn("w-6 h-6", pm.default ? "text-gold-400" : "text-white/40")} />
                  {pm.default && <span className="text-xs font-medium text-gold-400">Default</span>}
                  {pm.connected && !pm.default && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <div className="font-medium text-white">{pm.method}</div>
                <div className="text-xs text-white/40 mt-1">{pm.connected ? "Connected" : "Click to connect"}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
