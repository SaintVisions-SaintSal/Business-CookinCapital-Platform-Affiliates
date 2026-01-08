import Link from "next/link"
import { Bot, Building2, TrendingUp, Users, DollarSign, MessageSquare, ArrowUpRight, ChevronRight } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Earnings",
      value: "$0.00",
      change: "+23%",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "from-green-500/20 to-emerald-500/20",
    },
    {
      label: "Active Referrals",
      value: "0",
      change: "+12",
      icon: Users,
      color: "text-amber-400",
      bgColor: "from-amber-500/20 to-orange-500/20",
    },
    {
      label: "Properties Analyzed",
      value: "0",
      change: "+8",
      icon: Building2,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      label: "AI Queries",
      value: "0",
      change: "+156",
      icon: Bot,
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-pink-500/20",
    },
  ]

  const quickActions = [
    {
      name: "Chat with SaintSal™",
      icon: MessageSquare,
      href: "/dashboard/chat",
      color: "from-amber-500 to-orange-500",
    },
    { name: "Trading Platform", icon: TrendingUp, href: "/dashboard/trading", color: "from-green-500 to-emerald-500" },
    { name: "Real Estate Deals", icon: Building2, href: "/dashboard/real-estate", color: "from-blue-500 to-cyan-500" },
    { name: "Affiliate Dashboard", icon: Users, href: "/dashboard/affiliates", color: "from-purple-500 to-pink-500" },
  ]

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back!</h1>
          <p className="text-neutral-400">Here's what's happening with your empire today.</p>
        </div>
        <Link
          href="/dashboard/affiliates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl hover:bg-green-500/20 transition-all"
        >
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">Earn 30% Commission</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm text-green-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="group p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800/50 transition-all"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{action.name}</span>
                <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Affiliate CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Industry-Leading Commission
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Earn 30% Recurring Commission</h3>
            <p className="text-neutral-400 max-w-xl">
              Refer friends and earn up to $149.10/month per Enterprise referral. No caps, no limits. Build true passive
              income.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="text-center p-4 rounded-xl bg-black/30">
              <div className="text-3xl font-bold text-green-400">$149.10</div>
              <div className="text-sm text-neutral-500">per Enterprise/mo</div>
            </div>
            <Link
              href="/dashboard/affiliates"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all"
            >
              View Affiliate Dashboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
