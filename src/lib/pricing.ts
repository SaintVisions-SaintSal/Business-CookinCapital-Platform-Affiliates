// Pricing configuration - client-safe, no Stripe SDK
export const PRICING = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    ghlProductId: "694671739e4922feddcc3e1e",
    features: ["50 AI queries/month", "5 property scores", "Basic chat interface", "Email support"],
    limits: {
      queries: 50,
      propertyScores: 5,
      teamMembers: 1,
    },
  },
  starter: {
    name: "Starter",
    price: 27,
    yearlyPrice: 270,
    priceId: "price_starter_monthly",
    ghlProductId: "69464c136d52f05832acd6d5",
    features: [
      "500 AI queries/month",
      "50 property scores",
      "Voice agent access",
      "3 team members",
      "Priority support",
    ],
    limits: {
      queries: 500,
      propertyScores: 50,
      teamMembers: 3,
    },
  },
  pro: {
    name: "Pro",
    price: 97,
    yearlyPrice: 970,
    priceId: "price_pro_monthly",
    ghlProductId: "694677961e9e6a5435be0d10",
    features: [
      "Unlimited AI queries",
      "Unlimited property scores",
      "War Room access",
      "Coding agent",
      "Affiliate dashboard",
      "10 team members",
      "Phone support",
    ],
    limits: {
      queries: -1,
      propertyScores: -1,
      teamMembers: 10,
    },
    popular: true,
  },
  teams: {
    name: "Teams",
    price: 297,
    yearlyPrice: 2970,
    priceId: "price_teams_monthly",
    ghlProductId: "69467a30d0aaf6f7a96a8d9b",
    features: [
      "Everything in Pro",
      "Trading platform",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
    ],
    limits: {
      queries: -1,
      propertyScores: -1,
      teamMembers: -1,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 497,
    yearlyPrice: 4970,
    priceId: "price_enterprise_monthly",
    ghlProductId: "69467bdcccecbd04ba5f18a7",
    features: [
      "Everything in Teams",
      "Full API access",
      "White-label options",
      "Custom AI training",
      "SLA guarantee",
      "Dedicated account manager",
      "Priority onboarding",
    ],
    limits: {
      queries: -1,
      propertyScores: -1,
      teamMembers: -1,
    },
  },
} as const

export type PlanKey = keyof typeof PRICING

// Commission rates for affiliate program
export const COMMISSION_RATES = {
  affiliate: 0.3, // 30% for regular affiliates
  vp: 0.15, // Additional 15% override for VPs
} as const

// Calculate commission for a plan
export function calculateCommission(planKey: PlanKey, isVP = false): number {
  const plan = PRICING[planKey]
  const baseCommission = plan.price * COMMISSION_RATES.affiliate
  const vpOverride = isVP ? plan.price * COMMISSION_RATES.vp : 0
  return baseCommission + vpOverride
}
