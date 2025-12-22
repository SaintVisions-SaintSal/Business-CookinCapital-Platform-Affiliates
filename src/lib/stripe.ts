import Stripe from "stripe"

// Server-only Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Re-export pricing from separate file for convenience in server components
export { PRICING, type PlanKey, COMMISSION_RATES, calculateCommission } from "./pricing"

// Create Stripe checkout session
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata,
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  })

  return session
}

// Create Stripe Connect account for affiliates
export async function createConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      transfers: { requested: true },
    },
  })

  return account
}

// Create account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })

  return accountLink
}

// Transfer commission to affiliate
export async function transferToAffiliate(amount: number, destinationAccountId: string, description: string) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    destination: destinationAccountId,
    description,
  })

  return transfer
}
