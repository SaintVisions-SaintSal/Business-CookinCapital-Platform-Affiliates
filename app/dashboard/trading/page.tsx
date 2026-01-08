"use client"

import { useState, Suspense } from "react"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Loader2,
  Info,
  AlertCircle,
  DollarSign,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
}

interface TradeAnalysis {
  action: "BUY" | "SELL" | "HOLD"
  confidence: number
  reasoning: string
  targetPrice: number
  stopLoss: number
  fees: {
    commission: number
    secFee: number
    total: number
  }
  settlement: string
}

function TradingContent() {
  const [searchSymbol, setSearchSymbol] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [shares, setShares] = useState("")
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSearch = async () => {
    if (!searchSymbol.trim()) return
    setIsSearching(true)
    setError("")
    setQuote(null)
    setAnalysis(null)

    setTimeout(() => {
      const symbol = searchSymbol.toUpperCase()

      const mockQuotes: Record<string, StockQuote> = {
        AAPL: {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 178.72,
          change: 2.34,
          changePercent: 1.33,
          volume: 52340000,
          high: 180.1,
          low: 176.5,
          open: 177.0,
          previousClose: 176.38,
        },
        TSLA: {
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 248.5,
          change: -5.2,
          changePercent: -2.05,
          volume: 98760000,
          high: 255.0,
          low: 246.0,
          open: 253.5,
          previousClose: 253.7,
        },
        NVDA: {
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          price: 495.22,
          change: 12.45,
          changePercent: 2.58,
          volume: 45230000,
          high: 498.0,
          low: 480.0,
          open: 483.0,
          previousClose: 482.77,
        },
        MSFT: {
          symbol: "MSFT",
          name: "Microsoft Corp.",
          price: 378.91,
          change: 4.12,
          changePercent: 1.1,
          volume: 21450000,
          high: 380.5,
          low: 374.0,
          open: 375.0,
          previousClose: 374.79,
        },
        AMZN: {
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          price: 178.25,
          change: 1.89,
          changePercent: 1.07,
          volume: 35670000,
          high: 179.5,
          low: 175.0,
          open: 176.0,
          previousClose: 176.36,
        },
        GOOGL: {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 141.8,
          change: -0.95,
          changePercent: -0.67,
          volume: 28900000,
          high: 143.5,
          low: 140.0,
          open: 142.5,
          previousClose: 142.75,
        },
      }

      if (mockQuotes[symbol]) {
        setQuote(mockQuotes[symbol])

        const isPositive = mockQuotes[symbol].change > 0
        setAnalysis({
          action: isPositive ? "BUY" : "HOLD",
          confidence: Math.floor(Math.random() * 30) + 60,
          reasoning: isPositive
            ? `${symbol} shows strong momentum with positive price action.`
            : `${symbol} is experiencing selling pressure. Consider waiting.`,
          targetPrice: mockQuotes[symbol].price * (isPositive ? 1.15 : 1.05),
          stopLoss: mockQuotes[symbol].price * 0.92,
          fees: {
            commission: 0,
            secFee: Number.parseFloat((mockQuotes[symbol].price * 100 * 0.0000278).toFixed(2)),
            total: Number.parseFloat((mockQuotes[symbol].price * 100 * 0.0000278).toFixed(2)),
          },
          settlement: "T+2 (2 business days)",
        })
      } else {
        setError(`Symbol "${symbol}" not found. Try AAPL, TSLA, NVDA, MSFT, AMZN, or GOOGL.`)
      }

      setIsSearching(false)
    }, 1500)
  }

  const calculateTradeValue = () => {
    if (!quote || !shares) return { total: 0, fees: 0 }
    const sharesNum = Number.parseInt(shares) || 0
    const total = quote.price * sharesNum
    const fees = total * 0.0000278
    return { total, fees }
  }

  const tradeValue = calculateTradeValue()

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Investment Research</h1>
          <p className="text-neutral-400">
            Research stocks, learn investing basics, and help your clients. Powered by SaintSal™ AI.
          </p>
        </div>
        <a
          href="https://cookinflips.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-all"
        >
          CookinFlips Platform
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-white font-bold mb-2">What is Buying?</h3>
          <p className="text-neutral-400 text-sm">
            When you <strong className="text-green-400">BUY</strong> a stock, you&apos;re purchasing ownership shares in
            a company. You profit when the stock price rises above your purchase price.
          </p>
          <div className="mt-3 p-2 rounded-lg bg-neutral-800/50 text-xs text-neutral-400">
            <strong className="text-white">Example:</strong> Buy 10 shares of AAPL at $150 = $1,500. If it rises to
            $180, your shares are worth $1,800 (+$300 profit).
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-white font-bold mb-2">What is Selling?</h3>
          <p className="text-neutral-400 text-sm">
            When you <strong className="text-red-400">SELL</strong>, you exchange your shares for cash. Settlement takes
            T+2 (2 business days) for funds to clear.
          </p>
          <div className="mt-3 p-2 rounded-lg bg-neutral-800/50 text-xs text-neutral-400">
            <strong className="text-white">Example:</strong> Sell 10 shares at $180 = $1,800. Minus SEC fee (~$0.05).
            Cash settles in 2 days.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-white font-bold mb-2">What are Bonds?</h3>
          <p className="text-neutral-400 text-sm">
            Bonds are <strong className="text-blue-400">loans</strong> to companies or governments. You earn fixed
            interest payments and get your principal back at maturity.
          </p>
          <div className="mt-3 p-2 rounded-lg bg-neutral-800/50 text-xs text-neutral-400">
            <strong className="text-white">Example:</strong> $1,000 bond at 5% pays $50/year. Lower risk than stocks,
            but lower returns.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#d4a106]/10 to-[#d4a106]/5 border border-[#d4a106]/20">
          <div className="w-10 h-10 rounded-xl bg-[#d4a106]/20 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-[#d4a106]" />
          </div>
          <h3 className="text-white font-bold mb-2">Fees & Costs</h3>
          <p className="text-neutral-400 text-sm">
            Most brokers offer <strong className="text-[#d4a106]">$0 commissions</strong>. SEC fees are minimal
            (~$0.0000278 per dollar sold). No hidden costs.
          </p>
          <div className="mt-3 p-2 rounded-lg bg-neutral-800/50 text-xs text-neutral-400">
            <strong className="text-white">Example:</strong> Selling $10,000 of stock costs ~$0.28 in SEC fees.
            That&apos;s it!
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-2xl">
          <label className="block text-sm text-neutral-400 mb-2">Search Stock Symbol</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter symbol (e.g., AAPL, TSLA, NVDA)"
              className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106] uppercase"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
          </div>
          {error && (
            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Quote & Analysis */}
      {quote && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quote Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">{quote.symbol}</h2>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                      quote.change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {quote.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {quote.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-neutral-400">{quote.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">${quote.price.toFixed(2)}</div>
                <div className={quote.change >= 0 ? "text-green-400" : "text-red-400"}>
                  {quote.change >= 0 ? "+" : ""}
                  {quote.change.toFixed(2)} today
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-neutral-800/50">
                <div className="text-neutral-400 text-xs mb-1">Open</div>
                <div className="text-white font-medium">${quote.open.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/50">
                <div className="text-neutral-400 text-xs mb-1">High</div>
                <div className="text-green-400 font-medium">${quote.high.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/50">
                <div className="text-neutral-400 text-xs mb-1">Low</div>
                <div className="text-red-400 font-medium">${quote.low.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/50">
                <div className="text-neutral-400 text-xs mb-1">Volume</div>
                <div className="text-white font-medium">{(quote.volume / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {analysis && (
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#d4a106]/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#d4a106]" />
                </div>
                <h3 className="font-bold text-white">SaintSal™ Analysis</h3>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 ${
                  analysis.action === "BUY"
                    ? "bg-green-500/20 text-green-400"
                    : analysis.action === "SELL"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {analysis.action === "BUY" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : analysis.action === "SELL" ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                {analysis.action} ({analysis.confidence}% confidence)
              </div>

              <p className="text-neutral-400 text-sm mb-4">{analysis.reasoning}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Target Price</span>
                  <span className="text-green-400 font-medium">${analysis.targetPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stop Loss</span>
                  <span className="text-red-400 font-medium">${analysis.stopLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Settlement</span>
                  <span className="text-white">{analysis.settlement}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trade Calculator */}
      {quote && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-bold text-white mb-4">Trade Calculator</h3>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTradeType("buy")}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  tradeType === "buy" ? "bg-green-500 text-white" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  tradeType === "sell" ? "bg-red-500 text-white" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                Sell
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-2">Number of Shares</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
              />
            </div>

            {shares && (
              <div className="p-4 rounded-xl bg-neutral-800/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Share Price</span>
                  <span className="text-white">${quote.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shares</span>
                  <span className="text-white">{shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SEC Fee</span>
                  <span className="text-neutral-400">${tradeValue.fees.toFixed(4)}</span>
                </div>
                <div className="border-t border-neutral-700 pt-2 flex justify-between">
                  <span className="text-white font-medium">Total {tradeType === "buy" ? "Cost" : "Proceeds"}</span>
                  <span className={`text-xl font-bold ${tradeType === "buy" ? "text-white" : "text-green-400"}`}>
                    ${(tradeValue.total + (tradeType === "buy" ? tradeValue.fees : -tradeValue.fees)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-[#d4a106]" />
              <h3 className="text-lg font-bold text-white">Partner Information</h3>
            </div>
            <div className="space-y-4 text-sm">
              <p className="text-neutral-400">
                This tool helps you research stocks and provide informed guidance to your clients. Actual trading is
                done through <strong className="text-white">CookinFlips.com</strong>.
              </p>
              <div className="p-4 rounded-xl bg-[#d4a106]/10 border border-[#d4a106]/30">
                <h4 className="text-[#d4a106] font-medium mb-2">Your Commission</h4>
                <p className="text-neutral-400 text-sm">
                  Earn <strong className="text-white">15-25%</strong> commission on every client you refer to
                  CookinFlips who opens an account and trades.
                </p>
              </div>
              <a
                href="https://cookinflips.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all"
              >
                Refer Client to CookinFlips
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Empty State with more educational content */}
      {!quote && !isSearching && !error && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
          <h3 className="text-xl font-bold text-white mb-2">Search for a Stock</h3>
          <p className="text-neutral-400 mb-6">Enter a symbol above to get real-time quotes and AI analysis.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL"].map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  setSearchSymbol(symbol)
                }}
                className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-[#d4a106]" />
          <h2 className="text-xl font-bold text-white">Common Client Questions</h2>
        </div>
        <p className="text-neutral-400 mb-6">
          Quick answers to help you assist your clients with investment questions.
        </p>

        <div className="space-y-3">
          {[
            {
              q: "How long does it take to buy or sell a stock?",
              a: "Trades execute almost instantly during market hours (9:30 AM - 4:00 PM ET). However, settlement takes T+2 (2 business days) for the cash or shares to officially transfer. You can trade again immediately, but withdrawing cash requires waiting for settlement.",
            },
            {
              q: "What's the difference between stocks and bonds?",
              a: "Stocks represent ownership in a company - you profit when the company grows and the stock price rises. Bonds are loans you make to companies or governments - you receive fixed interest payments and your principal back at maturity. Stocks have higher risk/reward; bonds are more stable with lower returns.",
            },
            {
              q: "How much money do I need to start investing?",
              a: "With CookinFlips, you can start with as little as $1 thanks to fractional shares. No minimum balance required. We recommend starting with an amount you're comfortable with and building over time.",
            },
            {
              q: "What are the fees for trading?",
              a: "CookinFlips offers $0 commission trading on stocks and ETFs. The only fee is the SEC regulatory fee of $0.0000278 per dollar on sell orders (about $0.28 on a $10,000 sale). No hidden fees, no account minimums.",
            },
            {
              q: "What happens if a stock I own goes down?",
              a: "You only lose money if you sell at a lower price than you bought. Many successful investors hold through downturns. Diversification (owning multiple stocks) helps reduce risk. Never invest money you can't afford to lose.",
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-white font-medium">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CookinCapital CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#d4a106]/10 to-transparent border border-[#d4a106]/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Client Need Capital?</h3>
            <p className="text-neutral-400">
              CookinCapital™ offers business loans, lines of credit, and equipment financing.
            </p>
          </div>
          <a
            href="https://cookincapital.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all whitespace-nowrap"
          >
            Apply for Financing
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function TradingPage() {
  return (
    <Suspense fallback={null}>
      <TradingContent />
    </Suspense>
  )
}
