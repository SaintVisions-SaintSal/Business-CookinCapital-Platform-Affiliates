import { DollarSign, Users, TrendingUp, Trophy, Wallet, Sparkles, ExternalLink } from "lucide-react"

export default function AffiliatesPage() {
  const referralCode = "SAINT2024"
  const referralLink = `https://cookinpartners.com?ref=${referralCode}`

  const commissionTiers = [
    { name: "Starter", price: 27, commission: 8.1, color: "border-neutral-700 bg-neutral-900/50" },
    { name: "Pro", price: 97, commission: 29.1, color: "border-amber-500/30 bg-amber-500/5" },
    { name: "Teams", price: 297, commission: 89.1, color: "border-blue-500/30 bg-blue-500/5" },
    {
      name: "Enterprise",
      price: 497,
      commission: 149.1,
      color: "border-purple-500/30 bg-purple-500/5",
      highlight: true,
    },
  ]

  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/20" },
    { label: "Active Referrals", value: "0", icon: Users, color: "text-amber-400", bg: "bg-amber-500/20" },
    { label: "Pending Payout", value: "$0.00", icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Conversion Rate", value: "0%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/20" },
  ]

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-2">
            <Trophy className="w-4 h-4" />
            SaintSal™ Affiliate Program
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Affiliate Dashboard</h1>
          <p className="text-neutral-400">Earn 30% recurring commission on every referral.</p>
        </div>
        <a
          href="https://cookinpartners.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Join at CookinPartners.com
        </a>
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

      {/* CookinPartners CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              Full Affiliate Portal
            </div>
            <h3 className="text-xl font-bold text-white mb-2">CookinPartners.com</h3>
            <p className="text-neutral-400">
              Access the complete affiliate portal with tracking, payouts, and marketing materials.
            </p>
          </div>
          <a
            href="https://cookinpartners.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            Go to CookinPartners
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">Commission Per Tier (30% Recurring)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commissionTiers.map((tier, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${tier.color} ${tier.highlight ? "ring-2 ring-purple-500/50" : ""}`}
            >
              {tier.highlight && <div className="text-xs font-bold text-purple-400 mb-2">HIGHEST EARNINGS</div>}
              <div className="text-neutral-400 text-sm mb-1">{tier.name}</div>
              <div className="text-2xl font-bold text-white mb-3">
                ${tier.price}
                <span className="text-neutral-500 text-base">/mo</span>
              </div>
              <div className="pt-3 border-t border-neutral-700">
                <div className="text-sm text-neutral-500">You Earn</div>
                <div className="text-3xl font-bold text-green-400">
                  ${tier.commission.toFixed(2)}
                  <span className="text-green-400/60 text-base">/mo</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">per active referral</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Calculator */}
      <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 mb-10">
        <h3 className="text-xl font-bold text-white mb-6">Earnings Calculator</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-black/30 text-center">
            <div className="text-neutral-400 mb-2">5 Enterprise Referrals</div>
            <div className="text-4xl font-bold text-green-400">$745.50</div>
            <div className="text-neutral-500 text-sm">/month recurring</div>
            <div className="text-neutral-600 text-xs mt-2">$8,946/year</div>
          </div>
          <div className="p-6 rounded-2xl bg-black/30 text-center border-2 border-green-500/30">
            <div className="text-green-400 text-sm font-bold mb-2">POPULAR GOAL</div>
            <div className="text-neutral-400 mb-2">10 Enterprise Referrals</div>
            <div className="text-5xl font-bold text-green-400">$1,491</div>
            <div className="text-neutral-500 text-sm">/month recurring</div>
            <div className="text-neutral-600 text-xs mt-2">$17,892/year</div>
          </div>
          <div className="p-6 rounded-2xl bg-black/30 text-center">
            <div className="text-neutral-400 mb-2">25 Enterprise Referrals</div>
            <div className="text-4xl font-bold text-green-400">$3,727.50</div>
            <div className="text-neutral-500 text-sm">/month recurring</div>
            <div className="text-neutral-600 text-xs mt-2">$44,730/year</div>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <span className="text-neutral-400">VP Partners earn an additional </span>
          <span className="text-amber-400 font-bold">15% override</span>
          <span className="text-neutral-400"> on their team's sales!</span>
        </div>
      </div>

      {/* Ecosystem Links */}
      <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-6">SaintSal™ Ecosystem</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://cookinpartners.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all"
          >
            <div className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2">
              CookinPartners.com
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-neutral-400 text-sm">Affiliate & partner program portal</p>
          </a>
          <a
            href="https://cookinflips.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            <div className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
              CookinFlips.com
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-neutral-400 text-sm">Real estate investments & fix-n-flips</p>
          </a>
          <a
            href="https://cookincapital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all"
          >
            <div className="text-amber-400 font-bold text-lg mb-2 flex items-center gap-2">
              CookinCapital.com
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-neutral-400 text-sm">Commercial & residential lending</p>
          </a>
        </div>
      </div>
    </div>
  )
}
