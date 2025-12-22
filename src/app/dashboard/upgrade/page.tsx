"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Sparkles, ArrowRight, Zap, TrendingUp, Users, Crown, Gift, Star } from "lucide-react"
import { PRICING, calculateCommission } from "@/lib/pricing"
import { formatCurrency, cn } from "@/lib/utils"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const PLAN_ICONS = {
  free: Sparkles,
  starter: Zap,
  pro: TrendingUp,
  teams: Users,
  enterprise: Crown,
}

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const paidPlans = Object.entries(PRICING).filter(([key]) => key !== "free")

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Upgrade Your Plan
          </span>
          <h1 className="text-4xl font-bold text-white mb-4">
            Unlock the Full Power of <span className="text-gold-gradient">SaintSal</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Billing Toggle */}
      <motion.div className="flex justify-center" variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-4 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
              billingCycle === "monthly" ? "bg-gold-500 text-black" : "text-white/60 hover:text-white",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              billingCycle === "yearly" ? "bg-gold-500 text-black" : "text-white/60 hover:text-white",
            )}
          >
            Yearly
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">Save 17%</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {paidPlans.map(([key, plan], i) => {
          const Icon = PLAN_ICONS[key as keyof typeof PLAN_ICONS] || Sparkles
          const price = billingCycle === "yearly" && "yearlyPrice" in plan ? plan.yearlyPrice / 12 : plan.price
          const isPopular = "popular" in plan && plan.popular
          const isEnterprise = key === "enterprise"
          const commission = calculateCommission(key as keyof typeof PRICING)

          return (
            <motion.div
              key={key}
              variants={fadeInUp}
              className={cn(
                "glass-card p-6 relative flex flex-col",
                isPopular && "border-gold-500/50 ring-2 ring-gold-500/20",
                isEnterprise &&
                  "border-purple-500/50 ring-2 ring-purple-500/20 bg-gradient-to-b from-purple-500/10 to-transparent",
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-500 text-black text-xs font-bold rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              {isEnterprise && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Full Access
                </div>
              )}

              <div className="mb-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    isEnterprise ? "bg-purple-500/20" : "bg-gold-500/10",
                  )}
                >
                  <Icon className={cn("w-5 h-5", isEnterprise ? "text-purple-400" : "text-gold-400")} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      isEnterprise
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                        : "text-gold-gradient",
                    )}
                  >
                    {formatCurrency(price)}
                  </span>
                  <span className="text-white/40 text-sm">/mo</span>
                </div>
                {billingCycle === "yearly" && "yearlyPrice" in plan && (
                  <p className="text-xs text-green-400 mt-1">Billed {formatCurrency(plan.yearlyPrice)}/year</p>
                )}
                <p className="text-xs text-gold-400/70 mt-2">Earn {formatCurrency(commission)}/mo per referral</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-xs text-white/70">
                    <Check
                      className={cn(
                        "w-3.5 h-3.5 mt-0.5 flex-shrink-0",
                        isEnterprise ? "text-purple-400" : "text-gold-500",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm",
                  isEnterprise
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : isPopular
                      ? "btn-gold"
                      : "btn-ghost",
                )}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        className="glass-card p-8 relative overflow-hidden border-gold-500/30"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-gold-400/20 to-gold-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-[100px]" />

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Gift className="w-10 h-10 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Affiliate Program</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                  30% Recurring
                </span>
              </div>
              <p className="text-white/60 text-lg max-w-xl">
                Earn <span className="text-gold-400 font-bold">30% recurring commissions</span> on every referral.
                Same-day payouts via Stripe. VPs earn an additional 15% override on their team!
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    ${calculateCommission("enterprise").toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40">Per Enterprise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-gradient">
                    ${calculateCommission("teams").toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40">Per Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-gradient">${calculateCommission("pro").toFixed(2)}</div>
                  <div className="text-xs text-white/40">Per Pro</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-gradient">
                    ${calculateCommission("starter").toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40">Per Starter</div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/dashboard/affiliates" className="btn-gold text-lg px-8 py-4 whitespace-nowrap">
            <Gift className="w-5 h-5 mr-2" />
            Join Affiliate Program
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.div>

      <motion.div className="glass-card p-8" variants={fadeInUp} initial="hidden" animate="visible">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Feature Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-medium text-white/50">Feature</th>
                <th className="text-center py-4 px-4 font-medium text-white/50">Starter</th>
                <th className="text-center py-4 px-4 font-medium text-gold-400">Pro</th>
                <th className="text-center py-4 px-4 font-medium text-white/50">Teams</th>
                <th className="text-center py-4 px-4 font-medium text-purple-400">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Monthly Price", starter: "$27", pro: "$97", teams: "$297", enterprise: "$497" },
                {
                  feature: "AI Queries",
                  starter: "500/mo",
                  pro: "Unlimited",
                  teams: "Unlimited",
                  enterprise: "Unlimited",
                },
                {
                  feature: "Property Scores",
                  starter: "50/mo",
                  pro: "Unlimited",
                  teams: "Unlimited",
                  enterprise: "Unlimited",
                },
                { feature: "Team Members", starter: "3", pro: "10", teams: "Unlimited", enterprise: "Unlimited" },
                { feature: "Voice Agent", starter: true, pro: true, teams: true, enterprise: true },
                { feature: "Trading Platform", starter: false, pro: false, teams: true, enterprise: true },
                { feature: "Real Estate Module", starter: false, pro: true, teams: true, enterprise: true },
                { feature: "War Room Access", starter: false, pro: true, teams: true, enterprise: true },
                { feature: "Code Agent", starter: false, pro: true, teams: true, enterprise: true },
                { feature: "Affiliate Dashboard", starter: false, pro: true, teams: true, enterprise: true },
                { feature: "API Access", starter: false, pro: false, teams: true, enterprise: true },
                { feature: "White-Label Options", starter: false, pro: false, teams: false, enterprise: true },
                { feature: "Custom AI Training", starter: false, pro: false, teams: false, enterprise: true },
                { feature: "SLA Guarantee", starter: false, pro: false, teams: false, enterprise: true },
                { feature: "Dedicated Account Mgr", starter: false, pro: false, teams: false, enterprise: true },
                { feature: "Priority Onboarding", starter: false, pro: false, teams: false, enterprise: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-4 px-4 text-white">{row.feature}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.starter === "boolean" ? (
                      row.starter ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )
                    ) : (
                      <span className="text-white/70">{row.starter}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-gold-500/5">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <Check className="w-5 h-5 text-gold-400 mx-auto" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )
                    ) : (
                      <span className="text-gold-400 font-medium">{row.pro}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.teams === "boolean" ? (
                      row.teams ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )
                    ) : (
                      <span className="text-white/70">{row.teams}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-purple-500/5">
                    {typeof row.enterprise === "boolean" ? (
                      row.enterprise ? (
                        <Check className="w-5 h-5 text-purple-400 mx-auto" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )
                    ) : (
                      <span className="text-purple-400 font-medium">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div className="text-center" variants={fadeInUp} initial="hidden" animate="visible">
        <p className="text-white/50">
          Have questions?{" "}
          <Link href="/contact" className="text-gold-400 hover:text-gold-300">
            Contact our team
          </Link>{" "}
          or check out our{" "}
          <Link href="/faq" className="text-gold-400 hover:text-gold-300">
            FAQ
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
