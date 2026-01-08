"use client"

import { useState } from "react"
import {
  DollarSign,
  Users,
  TrendingUp,
  Trophy,
  Wallet,
  Sparkles,
  ExternalLink,
  Crown,
  Shield,
  CheckCircle,
  FileText,
  Building,
  Landmark,
  Home,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

export default function AffiliatesPage() {
  const [referrals, setReferrals] = useState([5])
  const [showVPApplication, setShowVPApplication] = useState(false)
  const [vpForm, setVpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    socialMedia: "",
    followers: "",
    experience: "",
    taxForm: "w9",
  })

  // Rewardful signup link
  const rewardfulSignupLink =
    "https://saint-vision-technologies-llc.getrewardful.com/signup?campaign=affiliates-of-our-gotta-guy-saintsal"
  const rewardfulDashboardLink = "https://saint-vision-technologies-llc.getrewardful.com/login"

  // Commission calculations
  const plans = [
    { name: "Starter", price: 27 },
    { name: "PRO", price: 97 },
    { name: "Teams", price: 297 },
    { name: "Enterprise", price: 497 },
  ]

  const calculateCommission = (price: number, rate: number) => (price * rate).toFixed(2)

  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/20" },
    { label: "Active Referrals", value: "0", icon: Users, color: "text-amber-400", bg: "bg-amber-500/20" },
    { label: "Pending Payout", value: "$0.00", icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Conversion Rate", value: "0%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/20" },
  ]

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-2">
            <Trophy className="w-4 h-4" />
            CookinPartners™ Affiliate Program
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Partner Dashboard</h1>
          <p className="text-neutral-400">
            Earn <span className="text-amber-400 font-semibold">15-25%</span> recurring commissions promoting SaintSal™
            AI
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={rewardfulDashboardLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all border border-neutral-700"
          >
            <ExternalLink className="w-4 h-4" />
            Rewardful Dashboard
          </a>
          <a
            href={rewardfulSignupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Join as Partner (15%)
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Partner Tiers */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          CHOOSE YOUR <span className="text-amber-400">PARTNER</span> TIER
        </h2>
        <p className="text-neutral-400 mb-6">Two tiers to match your influence and earning potential</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Partner Tier - 15% */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-700/50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">PARTNER</h3>
                  <p className="text-neutral-500 text-sm">Standard affiliate</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-6">
                15%<span className="text-neutral-500 text-lg ml-2">commission</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Instant approval
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  90-day cookie duration
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  NET-15 payouts
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Lifetime recurring revenue
                </li>
              </ul>

              <a
                href={rewardfulSignupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all"
              >
                Join as Partner
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* VP Partner Tier - 25% */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
              INVITATION ONLY
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400">VP PARTNER</h3>
                  <p className="text-neutral-400 text-sm">Elite influencer tier</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-amber-400 mb-6">
                25%<span className="text-neutral-400 text-lg ml-2">commission</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  Application required
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  Social media verification
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  W-9 / W-8 BEN required
                </li>
                <li className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  Priority support & resources
                </li>
              </ul>

              <Button
                onClick={() => setShowVPApplication(!showVPApplication)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                {showVPApplication ? "Hide Application" : "Apply for VP Partner"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* VP Application Form */}
      {showVPApplication && (
        <div className="mb-10 p-8 rounded-3xl bg-neutral-900/50 border border-amber-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-amber-400" />
            <div>
              <h3 className="text-xl font-bold text-white">VP Partner Application</h3>
              <p className="text-neutral-400 text-sm">Apply for 25% commission tier</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-neutral-400 text-sm font-medium mb-2">FIRST NAME *</label>
              <Input
                placeholder="John"
                value={vpForm.firstName}
                onChange={(e) => setVpForm({ ...vpForm, firstName: e.target.value })}
                className="bg-black/50 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm font-medium mb-2">LAST NAME *</label>
              <Input
                placeholder="Smith"
                value={vpForm.lastName}
                onChange={(e) => setVpForm({ ...vpForm, lastName: e.target.value })}
                className="bg-black/50 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm font-medium mb-2">EMAIL ADDRESS *</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={vpForm.email}
                onChange={(e) => setVpForm({ ...vpForm, email: e.target.value })}
                className="bg-black/50 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-sm font-medium mb-2">PHONE NUMBER</label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={vpForm.phone}
                onChange={(e) => setVpForm({ ...vpForm, phone: e.target.value })}
                className="bg-black/50 border-neutral-700 text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-neutral-400 text-sm font-medium mb-2">SOCIAL MEDIA PROFILES *</label>
            <Input
              placeholder="Instagram, TikTok, YouTube, LinkedIn URLs"
              value={vpForm.socialMedia}
              onChange={(e) => setVpForm({ ...vpForm, socialMedia: e.target.value })}
              className="bg-black/50 border-neutral-700 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-neutral-400 text-sm font-medium mb-2">TOTAL FOLLOWERS / AUDIENCE SIZE *</label>
            <Input
              placeholder="e.g., 50,000+ across platforms"
              value={vpForm.followers}
              onChange={(e) => setVpForm({ ...vpForm, followers: e.target.value })}
              className="bg-black/50 border-neutral-700 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-neutral-400 text-sm font-medium mb-2">
              AFFILIATE / INFLUENCER EXPERIENCE *
            </label>
            <Textarea
              placeholder="Tell us about your experience promoting products, past affiliate programs, content creation, etc."
              value={vpForm.experience}
              onChange={(e) => setVpForm({ ...vpForm, experience: e.target.value })}
              className="bg-black/50 border-neutral-700 text-white min-h-[120px]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-neutral-400 text-sm font-medium mb-2">TAX FORM TYPE *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxForm"
                  value="w9"
                  checked={vpForm.taxForm === "w9"}
                  onChange={(e) => setVpForm({ ...vpForm, taxForm: e.target.value })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-white">W-9 (US Citizen)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxForm"
                  value="w8ben"
                  checked={vpForm.taxForm === "w8ben"}
                  onChange={(e) => setVpForm({ ...vpForm, taxForm: e.target.value })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-white">W-8 BEN (International)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Tax Documentation Required</p>
                <p className="text-neutral-400 text-sm">
                  You will be required to submit W-9 or W-8 BEN documentation before receiving VP Partner status and
                  payouts.
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:from-amber-400 hover:to-orange-400">
            Submit VP Partner Application
          </Button>
        </div>
      )}

      {/* Commission Calculator */}
      <div className="mb-10 p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800">
        <h2 className="text-2xl font-bold text-white mb-2">
          COMMISSION <span className="text-amber-400">CALCULATOR</span>
        </h2>
        <p className="text-neutral-400 mb-6">See your earning potential per referral</p>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-neutral-400">Referrals per month</span>
            <span className="text-2xl font-bold text-white">{referrals[0]}</span>
          </div>
          <Slider value={referrals} onValueChange={setReferrals} max={50} min={1} step={1} className="w-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Partner 15% */}
          <div className="p-6 rounded-2xl bg-black/30 border border-neutral-700">
            <h4 className="text-neutral-500 text-sm font-medium mb-4">PARTNER (15%)</h4>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div key={plan.name} className="flex justify-between items-center">
                  <span className="text-neutral-400">
                    {plan.name} (${plan.price}/mo)
                  </span>
                  <span className="text-white font-bold">${(plan.price * 0.15 * referrals[0]).toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>

          {/* VP Partner 25% */}
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/30">
            <h4 className="text-amber-400 text-sm font-medium mb-4">VP PARTNER (25%)</h4>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div key={plan.name} className="flex justify-between items-center">
                  <span className="text-neutral-400">
                    {plan.name} (${plan.price}/mo)
                  </span>
                  <span className="text-amber-400 font-bold">${(plan.price * 0.25 * referrals[0]).toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CookinCapital Ecosystem */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          COOKINCAPITAL <span className="text-amber-400">ECOSYSTEM</span>
        </h2>
        <p className="text-neutral-400 mb-6">Explore our lending, real estate, and investment platforms</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CookinCapital - Lending */}
          <a
            href="https://cookincapital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
              <Landmark className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              CookinCapital.com
              <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            </h3>
            <p className="text-neutral-400 text-sm mb-4">
              Commercial & residential lending powered by SaintSal™ AI underwriting
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                Hard money loans
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                Bridge financing
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                Commercial real estate
              </li>
            </ul>
          </a>

          {/* CookinFlips - Investments */}
          <a
            href="https://cookinflips.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Home className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              CookinFlips.com
              <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 transition-colors" />
            </h3>
            <p className="text-neutral-400 text-sm mb-4">Real estate investment deals and wholesale opportunities</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Fix & flip deals
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Wholesale contracts
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Investment analysis
              </li>
            </ul>
          </a>

          {/* CookinPartners - Affiliates */}
          <a
            href="https://cookinpartners.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4">
              <Building className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              CookinPartners.com
              <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-green-400 transition-colors" />
            </h3>
            <p className="text-neutral-400 text-sm mb-4">Official affiliate & partner program portal</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Full affiliate portal
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Marketing materials
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Payout tracking
              </li>
            </ul>
          </a>
        </div>
      </div>

      {/* Rewardful Integration Notice */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#2dd4bf" strokeWidth="2" />
                <path d="M8 12l2 2 4-4" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Powered by Rewardful</h3>
              <p className="text-neutral-400">
                All affiliate tracking, commissions, and payouts are managed through Rewardful. Access your dashboard to
                view real-time stats, referral links, and payment history.
              </p>
            </div>
          </div>
          <a
            href={rewardfulDashboardLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-400 transition-all whitespace-nowrap"
          >
            Open Rewardful Dashboard
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
