import { DollarSign, Download, Calendar, CreditCard, ArrowUpRight, ExternalLink } from "lucide-react"

export default function EarningsPage() {
  const totalEarnings = 0
  const pendingPayout = 0
  const paidOut = 0

  const transactions = [
    {
      date: "Coming Soon",
      type: "Commission",
      description: "Your first referral earnings will appear here",
      amount: 0,
      status: "Pending",
    },
  ]

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Earnings</h1>
          <p className="text-neutral-400">Track your affiliate commissions and request payouts.</p>
        </div>
        <a
          href="https://cookinpartners.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Manage at CookinPartners.com
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-neutral-300">Total Earnings</span>
          </div>
          <div className="text-3xl font-bold text-white">${Number(totalEarnings).toFixed(2)}</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-neutral-400">Pending</span>
          </div>
          <div className="text-3xl font-bold text-amber-400">${pendingPayout.toFixed(2)}</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-neutral-400">Paid Out</span>
          </div>
          <div className="text-3xl font-bold text-white">${paidOut.toFixed(2)}</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-neutral-400">This Month</span>
          </div>
          <div className="text-3xl font-bold text-white">$0.00</div>
        </div>
      </div>

      {/* CookinPartners CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Full Earnings Dashboard</h3>
            <p className="text-neutral-400">
              Access detailed analytics, payout requests, and transaction history at CookinPartners.com
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

      {/* Transactions */}
      <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="p-12 text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
          <p className="text-neutral-500 mb-4">No transactions yet</p>
          <p className="text-neutral-600 text-sm">Start referring to earn 30% recurring commission!</p>
        </div>
      </div>
    </div>
  )
}
