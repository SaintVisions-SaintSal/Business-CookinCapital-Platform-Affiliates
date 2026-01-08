"use client"

import { useState } from "react"
import { Landmark, Building2, Home, DollarSign, ArrowRight, Calculator, ExternalLink } from "lucide-react"

export default function LendingPage() {
  const [loanType, setLoanType] = useState<string | null>(null)
  const [loanAmount, setLoanAmount] = useState(500000)
  const [propertyValue, setPropertyValue] = useState(750000)

  const loanProducts = [
    {
      id: "fix-flip",
      name: "Fix & Flip",
      description: "Short-term financing for property renovations",
      rates: "10-12%",
      terms: "6-18 months",
      ltv: "Up to 90%",
      minLoan: "$75,000",
      icon: Home,
      color: "amber",
    },
    {
      id: "bridge",
      name: "Bridge Loans",
      description: "Quick capital for time-sensitive deals",
      rates: "9-11%",
      terms: "12-24 months",
      ltv: "Up to 80%",
      minLoan: "$100,000",
      icon: Building2,
      color: "blue",
    },
    {
      id: "dscr",
      name: "DSCR Rental",
      description: "Long-term rental property financing",
      rates: "7-9%",
      terms: "30 years",
      ltv: "Up to 80%",
      minLoan: "$100,000",
      icon: DollarSign,
      color: "green",
    },
    {
      id: "commercial",
      name: "Commercial",
      description: "Multi-family, retail, office, industrial",
      rates: "6-8%",
      terms: "5-25 years",
      ltv: "Up to 75%",
      minLoan: "$500,000",
      icon: Landmark,
      color: "purple",
    },
  ]

  const calculatePayment = () => {
    const rate = 0.1 / 12 // 10% annual rate
    const months = 12
    const payment = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    return payment.toFixed(2)
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">CookinCapital™ Lending</h1>
          <p className="text-neutral-400">Access institutional-grade real estate financing for your clients.</p>
        </div>
        <a
          href="https://cookincapital.com/apply"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all"
        >
          Apply Now
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="text-3xl font-bold text-[#d4a106] mb-1">$2B+</div>
          <p className="text-neutral-400 text-sm">Funds Deployed</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="text-3xl font-bold text-white mb-1">48hrs</div>
          <p className="text-neutral-400 text-sm">Average Approval</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="text-3xl font-bold text-white mb-1">50+</div>
          <p className="text-neutral-400 text-sm">Lending Partners</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="text-3xl font-bold text-green-400 mb-1">15%</div>
          <p className="text-neutral-400 text-sm">Partner Commission</p>
        </div>
      </div>

      {/* Loan Products */}
      <h2 className="text-xl font-bold text-white mb-6">Loan Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loanProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setLoanType(product.id)}
            className={`p-6 rounded-2xl border cursor-pointer transition-all ${
              loanType === product.id
                ? "bg-[#d4a106]/10 border-[#d4a106]"
                : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${product.color}-500/20 flex items-center justify-center mb-4`}>
              <product.icon className={`w-6 h-6 text-${product.color}-400`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
            <p className="text-neutral-400 text-sm mb-4">{product.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Rates</span>
                <span className="text-[#d4a106] font-medium">{product.rates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Terms</span>
                <span className="text-white">{product.terms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">LTV</span>
                <span className="text-white">{product.ltv}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Min Loan</span>
                <span className="text-white">{product.minLoan}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-[#d4a106]" />
            <h3 className="text-lg font-bold text-white">Quick Payment Calculator</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Loan Amount</label>
              <input
                type="range"
                min={75000}
                max={5000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#d4a106]"
              />
              <div className="text-2xl font-bold text-white mt-2">${loanAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Property Value</label>
              <input
                type="range"
                min={100000}
                max={10000000}
                step={50000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full accent-[#d4a106]"
              />
              <div className="text-2xl font-bold text-white mt-2">${propertyValue.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-800/50">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Est. Monthly Payment</span>
                <span className="text-2xl font-bold text-[#d4a106]">${calculatePayment()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-neutral-400">LTV Ratio</span>
                <span className="text-white font-medium">{((loanAmount / propertyValue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 className="text-lg font-bold text-white mb-6">How to Earn with Lending</h3>
          <div className="space-y-4">
            {[
              { step: "1", title: "Refer Your Client", desc: "Share your unique partner link or send them to apply" },
              { step: "2", title: "We Handle Everything", desc: "Our team manages underwriting, docs, and closing" },
              { step: "3", title: "Get Paid", desc: "Earn 15% of origination fees on every funded loan" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4a106]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#d4a106] font-bold">{item.step}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-neutral-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://cookincapital.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all"
          >
            Start Referring Clients
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Commission Examples */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#d4a106]/10 to-transparent border border-[#d4a106]/30">
        <h3 className="text-lg font-bold text-white mb-4">Your Commission Potential</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { loan: "$250,000", fee: "$5,000", commission: "$750" },
            { loan: "$500,000", fee: "$10,000", commission: "$1,500" },
            { loan: "$1,000,000", fee: "$20,000", commission: "$3,000" },
          ].map((example, i) => (
            <div key={i} className="text-center">
              <div className="text-neutral-400 text-sm mb-1">Loan: {example.loan}</div>
              <div className="text-neutral-400 text-sm mb-2">Origination Fee: {example.fee}</div>
              <div className="text-2xl font-bold text-[#d4a106]">{example.commission}</div>
              <div className="text-neutral-500 text-xs">Your Commission (15%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
