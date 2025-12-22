export interface PricingTier {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  highlighted?: boolean
  commission: number
}

export const PRICING: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: ["50 AI queries/month", "5 property scores", "Basic chat interface", "Email support"],
    commission: 0,
  },
  {
    id: "starter",
    name: "Starter",
    price: 27,
    interval: "month",
    features: [
      "500 AI queries/month",
      "50 property scores",
      "Voice agent access",
      "3 team members",
      "Priority support",
    ],
    commission: 8.1,
  },
  {
    id: "pro",
    name: "Pro",
    price: 97,
    interval: "month",
    features: [
      "Unlimited AI queries",
      "Unlimited property scores",
      "War Room access",
      "Coding agent",
      "Affiliate dashboard",
      "10 team members",
      "Phone support",
    ],
    highlighted: true,
    commission: 29.1,
  },
  {
    id: "teams",
    name: "Teams",
    price: 297,
    interval: "month",
    features: [
      "Everything in Pro",
      "Trading platform",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
    ],
    commission: 89.1,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 497,
    interval: "month",
    features: [
      "Everything in Teams",
      "White-label options",
      "Custom AI training",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    commission: 149.1,
  },
]

export const COMMISSION_RATE = 0.3 // 30% recurring commission

export function calculateCommission(price: number): number {
  return Number((price * COMMISSION_RATE).toFixed(2))
}

export function getPricingTier(id: string): PricingTier | undefined {
  return PRICING.find((tier) => tier.id === id)
}

export function getPaidTiers(): PricingTier[] {
  return PRICING.filter((tier) => tier.price > 0)
}
