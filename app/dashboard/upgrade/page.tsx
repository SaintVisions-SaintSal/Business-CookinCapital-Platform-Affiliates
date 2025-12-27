"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { Check, Zap, Crown, Rocket, DollarSign, X } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/stripe"
import { PRODUCTS } from "@/lib/products"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (!selectedPlan) {
      throw new Error("No plan selected")
    }
    const clientSecret = await createCheckoutSession(selectedPlan)
    if (!clientSecret) {
      throw new Error("Failed to create checkout session")
    }
    return clientSecret
  }, [selectedPlan])

  const plans = PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.priceInCents / 100,
    description: product.description,
    features: product.features,
    affiliateEarn: `$${((product.priceInCents / 100) * product.commissionRate).toFixed(2)}`,
    popular: product.popular,
    enterprise: product.enterprise,
  }))

  return (
    <div className="p-6 lg:p-10">
      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">Complete Your Purchase</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-6">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <Rocket className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-medium">Upgrade Your Plan</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Choose Your <span className="text-[#d4a106]">Power Level</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Unlock more features and earn higher affiliate commissions. All plans include 30% recurring commission.
        </p>
      </div>

      {/* Affiliate Earnings Highlight */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-bold">Affiliate Commission on Every Sale</span>
        </div>
        <p className="text-neutral-400">
          Earn <span className="text-green-400 font-bold">$8.10 - $149.10</span> per month for every referral!
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-3xl bg-neutral-900/50 border ${plan.popular ? "border-amber-500/30 ring-2 ring-amber-500/50" : plan.enterprise ? "border-purple-500/30 ring-2 ring-purple-500/50" : "border-neutral-800"}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-sm font-bold rounded-full flex items-center gap-1">
                <Crown className="w-4 h-4" /> Most Popular
              </div>
            )}
            {plan.enterprise && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                <Zap className="w-4 h-4" /> Best Value
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span
                className={`text-4xl font-bold ${plan.enterprise ? "text-purple-400" : plan.popular ? "text-amber-400" : "text-white"}`}
              >
                ${plan.price}
              </span>
              <span className="text-neutral-500">/mo</span>
            </div>
            <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>

            {/* Affiliate Earn Tag */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <DollarSign className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Affiliates earn {plan.affiliateEarn}/mo</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm">
                  <Check
                    className={`w-4 h-4 mt-0.5 ${plan.enterprise ? "text-purple-400" : plan.popular ? "text-amber-400" : "text-green-400"}`}
                  />
                  <span className="text-neutral-400">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                plan.enterprise
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400"
                  : plan.popular
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500"
                    : "bg-neutral-800 text-white hover:bg-neutral-700"
              }`}
            >
              Upgrade Now
            </button>
          </div>
        ))}
      </div>

      {/* VP Partner CTA */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 font-medium mb-4">
          <Crown className="w-4 h-4" />
          VP Partner Program
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Want to Earn Even More?</h3>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Become a VP Partner and earn <span className="text-amber-400 font-bold">15% override</span> on your entire
          team's sales.
        </p>
      </div>
    </div>
  )
}
