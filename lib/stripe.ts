import "server-only"
import Stripe from "stripe"
import { PRICING, type PricingTier } from "./pricing"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export { PRICING }
export type { PricingTier }

export async function createConnectAccount(email: string, userId: string): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: {
      user_id: userId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
  return account
}

export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string,
): Promise<Stripe.AccountLink> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })
  return accountLink
}

export async function transferToAffiliate(
  amount: number,
  destinationAccountId: string,
  description: string,
): Promise<Stripe.Transfer> {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "usd",
    destination: destinationAccountId,
    description,
  })
  return transfer
}

export async function createCheckoutSession(
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>,
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })
  return session
}

export async function createCustomer(email: string, userId: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
    },
  })
  return customer
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId)
}
