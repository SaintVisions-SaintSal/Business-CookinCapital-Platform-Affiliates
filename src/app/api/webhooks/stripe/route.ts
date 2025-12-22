import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN: Record<string, string> = {
  'price_starter_monthly': 'starter',
  'price_pro_monthly': 'pro',
  'price_teams_monthly': 'teams',
  'price_enterprise_monthly': 'enterprise',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          
          const userId = session.metadata?.user_id
          const plan = session.metadata?.plan || 'starter'

          if (userId) {
            // Update profile with Stripe customer ID
            await supabase
              .from('profiles')
              .update({ 
                stripe_customer_id: session.customer as string,
                tier: plan,
              })
              .eq('id', userId)

            // Create subscription record
            await supabase
              .from('subscriptions')
              .insert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                plan,
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })

            console.log(`✅ Subscription created for user ${userId}: ${plan}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id
        const plan = PRICE_TO_PLAN[priceId] || 'starter'

        // Update subscription in database
        const { data } = await supabase
          .from('subscriptions')
          .update({
            plan,
            status: subscription.status === 'active' ? 'active' : 
                   subscription.status === 'past_due' ? 'past_due' : 
                   subscription.status === 'canceled' ? 'canceled' : 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)
          .select('user_id')
          .single()

        if (data?.user_id) {
          // Update profile tier
          await supabase
            .from('profiles')
            .update({ tier: plan })
            .eq('id', data.user_id)
        }

        console.log(`✅ Subscription updated: ${subscription.id} -> ${plan}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status
        const { data } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
          .select('user_id')
          .single()

        if (data?.user_id) {
          // Downgrade to free tier
          await supabase
            .from('profiles')
            .update({ tier: 'free' })
            .eq('id', data.user_id)
        }

        console.log(`✅ Subscription canceled: ${subscription.id}`)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
          // Recurring payment - trigger commission for affiliates
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id, user_id, plan')
            .eq('stripe_subscription_id', invoice.subscription as string)
            .single()

          if (subscription) {
            // Get referred_by from profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('referred_by')
              .eq('id', subscription.user_id)
              .single()

            if (profile?.referred_by) {
              // Get affiliate
              const { data: affiliate } = await supabase
                .from('affiliates')
                .select('id, commission_rate, vp_id')
                .eq('affiliate_code', profile.referred_by)
                .eq('status', 'active')
                .single()

              if (affiliate) {
                const amounts: Record<string, number> = {
                  starter: 27,
                  pro: 97,
                  teams: 297,
                  enterprise: 497,
                }
                
                const subscriptionAmount = amounts[subscription.plan] || 0
                const commission = subscriptionAmount * affiliate.commission_rate

                // Create commission record
                await supabase.from('commissions').insert({
                  affiliate_id: affiliate.id,
                  subscription_id: subscription.id,
                  amount: commission,
                  type: 'direct',
                  status: 'pending',
                })

                // Update pending payout
                await supabase.rpc('increment_pending_payout', {
                  affiliate_id: affiliate.id,
                  amount: commission,
                })

                console.log(`✅ Commission created: $${commission} for affiliate ${affiliate.id}`)

                // Handle VP override if exists
                if (affiliate.vp_id) {
                  const { data: vp } = await supabase
                    .from('affiliates')
                    .select('id, override_rate')
                    .eq('id', affiliate.vp_id)
                    .eq('status', 'active')
                    .single()

                  if (vp?.override_rate) {
                    const overrideCommission = subscriptionAmount * vp.override_rate

                    await supabase.from('commissions').insert({
                      affiliate_id: vp.id,
                      subscription_id: subscription.id,
                      amount: overrideCommission,
                      type: 'override',
                      status: 'pending',
                    })

                    await supabase.rpc('increment_pending_payout', {
                      affiliate_id: vp.id,
                      amount: overrideCommission,
                    })

                    console.log(`✅ VP Override: $${overrideCommission} for VP ${vp.id}`)
                  }
                }
              }
            }
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }

        console.log(`⚠️ Payment failed for subscription: ${invoice.subscription}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
