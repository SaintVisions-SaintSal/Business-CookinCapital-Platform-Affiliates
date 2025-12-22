"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Star,
  Bell,
  RefreshCw,
  Wallet,
  PieChart,
  Zap,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, cn } from "@/lib/utils"
import type { TradingAccount, Position, TradeOrder } from "@/types/database"

// Mock market data (in production, this would come from a real API)
const MOCK_MARKET_DATA = {
  SPY: { price: 478.52, change: 1.23, changePercent: 0.26 },
  QQQ: { price: 408.76, change: -0.89, changePercent: -0.22 },
  AAPL: { price: 193.42, change: 2.15, changePercent: 1.12 },
  MSFT: { price: 374.58, change: 3.21, changePercent: 0.86 },
  NVDA: { price: 481.26, change: 8.45, changePercent: 1.79 },
  TSLA: { price: 248.73, change: -4.32, changePercent: -1.71 },
  AMZN: { price: 153.21, change: 1.87, changePercent: 1.24 },
  GOOGL: { price: 141.8, change: 0.95, changePercent: 0.67 },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function TradingPage() {
  const [account, setAccount] = useState<TradingAccount | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [orders, setOrders] = useState<TradeOrder[]>([])
  const [watchlist, setWatchlist] = useState<string[]>(["SPY", "QQQ", "AAPL", "NVDA", "TSLA"])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get trading account
      const { data: accountData } = await supabase.from("trading_accounts").select("*").eq("user_id", user.id).single()

      if (accountData) {
        setAccount(accountData)

        // Get positions
        const { data: positionsData } = await supabase
          .from("positions")
          .select("*")
          .eq("trading_account_id", accountData.id)
        setPositions(positionsData || [])

        // Get recent orders
        const { data: ordersData } = await supabase
          .from("trade_orders")
          .select("*")
          .eq("trading_account_id", accountData.id)
          .order("created_at", { ascending: false })
          .limit(10)
        setOrders(ordersData || [])
      }
    }
    loadData()
  }, [supabase])

  const totalPortfolioValue = account?.portfolio_value || 0
  const totalUnrealizedPL = positions.reduce((sum, p) => sum + (p.unrealized_pl || 0), 0)
  const dayChange = totalPortfolioValue * 0.0124 // Mock 1.24% day change

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Platform</h1>
          <p className="text-white/50 mt-1">Real-time market data and portfolio management</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => setShowOrderModal(true)} className="btn-gold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Order
          </button>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <Wallet className="w-6 h-6 text-gold-400" />
            <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
              +{((dayChange / totalPortfolioValue) * 100).toFixed(2)}%
            </span>
          </div>
          <div className="text-3xl font-bold text-gold-gradient">{formatCurrency(totalPortfolioValue || 125430)}</div>
          <div className="text-sm text-white/50">Portfolio Value</div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 text-gold-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(account?.buying_power || 45230)}</div>
          <div className="text-sm text-white/50">Buying Power</div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className={cn("text-3xl font-bold", totalUnrealizedPL >= 0 ? "text-green-400" : "text-red-400")}>
            {totalUnrealizedPL >= 0 ? "+" : ""}
            {formatCurrency(totalUnrealizedPL || 8432)}
          </div>
          <div className="text-sm text-white/50">Unrealized P/L</div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-6 h-6 text-gold-400" />
          </div>
          <div className={cn("text-3xl font-bold", dayChange >= 0 ? "text-green-400" : "text-red-400")}>
            {dayChange >= 0 ? "+" : ""}
            {formatCurrency(dayChange || 1556)}
          </div>
          <div className="text-sm text-white/50">Today's Change</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Positions */}
        <motion.div className="lg:col-span-2 glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gold-400" />
              Positions
            </h3>
            <span className="text-sm text-white/50">{positions.length || 5} holdings</span>
          </div>

          <div className="space-y-3">
            {/* Mock positions if none exist */}
            {[
              {
                symbol: "AAPL",
                quantity: 50,
                avg_entry_price: 178.5,
                current_price: 193.42,
                market_value: 9671,
                unrealized_pl: 746,
                unrealized_pl_percent: 8.36,
              },
              {
                symbol: "NVDA",
                quantity: 25,
                avg_entry_price: 420.0,
                current_price: 481.26,
                market_value: 12031.5,
                unrealized_pl: 1531.5,
                unrealized_pl_percent: 14.58,
              },
              {
                symbol: "MSFT",
                quantity: 30,
                avg_entry_price: 350.0,
                current_price: 374.58,
                market_value: 11237.4,
                unrealized_pl: 737.4,
                unrealized_pl_percent: 7.02,
              },
              {
                symbol: "TSLA",
                quantity: 40,
                avg_entry_price: 265.0,
                current_price: 248.73,
                market_value: 9949.2,
                unrealized_pl: -650.8,
                unrealized_pl_percent: -6.14,
              },
              {
                symbol: "GOOGL",
                quantity: 75,
                avg_entry_price: 135.0,
                current_price: 141.8,
                market_value: 10635,
                unrealized_pl: 510,
                unrealized_pl_percent: 5.04,
              },
            ].map((position, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => setSelectedSymbol(position.symbol)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-gold-400">{position.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{position.symbol}</div>
                    <div className="text-sm text-white/50">
                      {position.quantity} shares @ {formatCurrency(position.avg_entry_price)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">{formatCurrency(position.market_value)}</div>
                  <div
                    className={cn(
                      "text-sm flex items-center justify-end gap-1",
                      position.unrealized_pl >= 0 ? "text-green-400" : "text-red-400",
                    )}
                  >
                    {position.unrealized_pl >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {position.unrealized_pl >= 0 ? "+" : ""}
                    {formatCurrency(position.unrealized_pl)} ({position.unrealized_pl_percent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Watchlist */}
        <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-400" />
              Watchlist
            </h3>
            <button className="text-sm text-gold-400 hover:text-gold-300">Edit</button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            {Object.entries(MOCK_MARKET_DATA).map(([symbol, data]) => (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => setSelectedSymbol(symbol)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold-400">{symbol.slice(0, 2)}</span>
                  </div>
                  <span className="font-medium text-white">{symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">{formatCurrency(data.price)}</div>
                  <div className={cn("text-xs", data.changePercent >= 0 ? "text-green-400" : "text-red-400")}>
                    {data.changePercent >= 0 ? "+" : ""}
                    {data.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            Recent Orders
          </h3>
          <button className="text-sm text-gold-400 hover:text-gold-300">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Side</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  symbol: "NVDA",
                  side: "buy",
                  type: "market",
                  quantity: 10,
                  price: 478.5,
                  status: "filled",
                  time: "10:32 AM",
                },
                {
                  symbol: "AAPL",
                  side: "buy",
                  type: "limit",
                  quantity: 25,
                  price: 192.0,
                  status: "filled",
                  time: "9:45 AM",
                },
                {
                  symbol: "TSLA",
                  side: "sell",
                  type: "market",
                  quantity: 15,
                  price: 252.3,
                  status: "filled",
                  time: "Yesterday",
                },
                {
                  symbol: "SPY",
                  side: "buy",
                  type: "limit",
                  quantity: 50,
                  price: 475.0,
                  status: "pending",
                  time: "Yesterday",
                },
              ].map((order, i) => (
                <tr key={i} className="border-b border-white/5 text-sm">
                  <td className="py-4 font-medium text-white">{order.symbol}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        order.side === "buy" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400",
                      )}
                    >
                      {order.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-white/70 capitalize">{order.type}</td>
                  <td className="py-4 text-white/70">{order.quantity}</td>
                  <td className="py-4 text-white/70">{formatCurrency(order.price)}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        order.status === "filled"
                          ? "bg-green-500/10 text-green-400"
                          : order.status === "pending"
                            ? "bg-gold-500/10 text-gold-400"
                            : "bg-red-500/10 text-red-400",
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-white/50">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Trading Signals */}
      <motion.div
        className="glass-card p-6 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px]" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold-400" />
              AI Trading Signals
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400">PRO Feature</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { symbol: "NVDA", signal: "BUY", confidence: 92, target: 520, stop: 460 },
              { symbol: "AAPL", signal: "HOLD", confidence: 78, target: 205, stop: 185 },
              { symbol: "MSFT", signal: "BUY", confidence: 85, target: 400, stop: 355 },
              { symbol: "TSLA", signal: "WATCH", confidence: 65, target: 280, stop: 230 },
            ].map((signal, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white">{signal.symbol}</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-bold",
                      signal.signal === "BUY"
                        ? "bg-green-500/20 text-green-400"
                        : signal.signal === "SELL"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gold-500/20 text-gold-400",
                    )}
                  >
                    {signal.signal}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Confidence</span>
                    <span className="text-white font-medium">{signal.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Target</span>
                    <span className="text-green-400">{formatCurrency(signal.target)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Stop Loss</span>
                    <span className="text-red-400">{formatCurrency(signal.stop)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
