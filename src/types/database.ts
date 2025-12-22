export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          company: string | null
          role: "user" | "affiliate" | "vp" | "admin"
          tier: "free" | "starter" | "pro" | "teams" | "enterprise"
          stripe_customer_id: string | null
          ghl_contact_id: string | null
          affiliate_code: string | null
          referred_by: string | null
          onboarding_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          ghl_subscription_id: string | null
          plan: "free" | "starter" | "pro" | "teams" | "enterprise"
          status: "active" | "canceled" | "past_due" | "trialing"
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & { user_id: string }
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          affiliate_code: string
          tier: "jr" | "vp"
          commission_rate: number
          override_rate: number | null
          vp_id: string | null
          total_earnings: number
          pending_payout: number
          lifetime_referrals: number
          active_referrals: number
          stripe_connect_id: string | null
          paypal_email: string | null
          payout_method: "stripe" | "paypal" | "wise" | "bank"
          bank_account_last4: string | null
          status: "pending" | "active" | "suspended"
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["affiliates"]["Row"]> & { user_id: string; affiliate_code: string }
        Update: Partial<Database["public"]["Tables"]["affiliates"]["Row"]>
      }
      commissions: {
        Row: {
          id: string
          affiliate_id: string
          subscription_id: string | null
          referral_user_id: string | null
          amount: number
          type: "direct" | "override" | "bonus"
          status: "pending" | "approved" | "paid" | "canceled"
          payout_id: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["commissions"]["Row"]> & { affiliate_id: string; amount: number }
        Update: Partial<Database["public"]["Tables"]["commissions"]["Row"]>
      }
      payouts: {
        Row: {
          id: string
          affiliate_id: string
          amount: number
          method: string
          stripe_transfer_id: string | null
          status: "pending" | "processing" | "completed" | "failed"
          processed_at: string | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["payouts"]["Row"]> & {
          affiliate_id: string
          amount: number
          method: string
        }
        Update: Partial<Database["public"]["Tables"]["payouts"]["Row"]>
      }
      trading_accounts: {
        Row: {
          id: string
          user_id: string
          provider: "alpaca" | "tradier" | "ibkr" | "paper"
          account_id: string | null
          account_type: "paper" | "live"
          api_key_encrypted: string | null
          api_secret_encrypted: string | null
          buying_power: number
          cash: number
          portfolio_value: number
          status: "active" | "inactive" | "pending" | "suspended"
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["trading_accounts"]["Row"]> & { user_id: string }
        Update: Partial<Database["public"]["Tables"]["trading_accounts"]["Row"]>
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          symbols: string[]
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["watchlists"]["Row"]> & { user_id: string; name: string }
        Update: Partial<Database["public"]["Tables"]["watchlists"]["Row"]>
      }
      trade_orders: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string | null
          external_order_id: string | null
          symbol: string
          side: "buy" | "sell"
          order_type: "market" | "limit" | "stop" | "stop_limit"
          quantity: number
          limit_price: number | null
          stop_price: number | null
          filled_quantity: number
          filled_avg_price: number | null
          status: "pending" | "submitted" | "accepted" | "filled" | "partially_filled" | "canceled" | "rejected"
          time_in_force: "day" | "gtc" | "ioc" | "fok"
          submitted_at: string | null
          filled_at: string | null
          canceled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["trade_orders"]["Row"]> & {
          user_id: string
          symbol: string
          side: "buy" | "sell"
          order_type: string
          quantity: number
        }
        Update: Partial<Database["public"]["Tables"]["trade_orders"]["Row"]>
      }
      positions: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string | null
          symbol: string
          quantity: number
          avg_entry_price: number
          current_price: number | null
          market_value: number | null
          unrealized_pl: number | null
          unrealized_pl_percent: number | null
          side: "long" | "short"
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["positions"]["Row"]> & {
          user_id: string
          symbol: string
          quantity: number
          avg_entry_price: number
        }
        Update: Partial<Database["public"]["Tables"]["positions"]["Row"]>
      }
      trade_signals: {
        Row: {
          id: string
          user_id: string | null
          symbol: string
          signal_type: "buy" | "sell" | "hold" | "watch"
          source: "ai" | "technical" | "fundamental" | "manual"
          confidence: number | null
          target_price: number | null
          stop_loss: number | null
          notes: string | null
          is_public: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["trade_signals"]["Row"]> & { symbol: string; signal_type: string }
        Update: Partial<Database["public"]["Tables"]["trade_signals"]["Row"]>
      }
      properties: {
        Row: {
          id: string
          user_id: string
          address: string
          city: string | null
          state: string | null
          zip: string | null
          county: string | null
          property_type: "single_family" | "multi_family" | "condo" | "townhouse" | "land" | "commercial" | "mixed_use"
          bedrooms: number | null
          bathrooms: number | null
          sqft: number | null
          lot_size: number | null
          year_built: number | null
          estimated_value: number | null
          arv: number | null
          repair_estimate: number | null
          mao: number | null
          owner_name: string | null
          owner_phone: string | null
          owner_email: string | null
          mailing_address: string | null
          status: "lead" | "contacted" | "negotiating" | "under_contract" | "assigned" | "closed" | "dead"
          lead_source: string | null
          ai_score: number | null
          ai_analysis: Json | null
          images: string[] | null
          documents: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["properties"]["Row"]> & { user_id: string; address: string }
        Update: Partial<Database["public"]["Tables"]["properties"]["Row"]>
      }
      wholesale_deals: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          purchase_price: number | null
          earnest_money: number | null
          inspection_period: number
          closing_date: string | null
          assignment_fee: number | null
          buyer_id: string | null
          buyer_name: string | null
          buyer_phone: string | null
          buyer_email: string | null
          expected_profit: number | null
          actual_profit: number | null
          status:
            | "prospecting"
            | "offer_sent"
            | "under_contract"
            | "finding_buyer"
            | "assigned"
            | "closing"
            | "closed"
            | "canceled"
          stage: number
          purchase_contract_url: string | null
          assignment_contract_url: string | null
          title_company: string | null
          closing_attorney: string | null
          offer_date: string | null
          contract_date: string | null
          assignment_date: string | null
          closed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["wholesale_deals"]["Row"]> & { user_id: string }
        Update: Partial<Database["public"]["Tables"]["wholesale_deals"]["Row"]>
      }
      cash_buyers: {
        Row: {
          id: string
          user_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          buying_criteria: Json | null
          deals_closed: number
          last_purchase_date: string | null
          rating: number | null
          notes: string | null
          status: "active" | "inactive" | "vip"
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["cash_buyers"]["Row"]> & { user_id: string; name: string }
        Update: Partial<Database["public"]["Tables"]["cash_buyers"]["Row"]>
      }
      deals: {
        Row: {
          id: string
          user_id: string
          borrower_name: string | null
          borrower_email: string | null
          borrower_phone: string | null
          property_address: string | null
          property_type: string | null
          loan_amount: number | null
          loan_type:
            | "fix_flip"
            | "dscr"
            | "bridge"
            | "construction"
            | "conventional"
            | "fha"
            | "va"
            | "hard_money"
            | "private"
            | null
          interest_rate: number | null
          term_months: number | null
          ltv: number | null
          status:
            | "lead"
            | "application"
            | "processing"
            | "underwriting"
            | "approved"
            | "docs_out"
            | "funded"
            | "closed"
            | "lost"
          stage: number
          probability: number
          assigned_to: string | null
          expected_close_date: string | null
          actual_close_date: string | null
          documents: Json | null
          notes: string | null
          last_activity_at: string
          next_follow_up: string | null
          lead_source: string | null
          referrer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["deals"]["Row"]> & { user_id: string }
        Update: Partial<Database["public"]["Tables"]["deals"]["Row"]>
      }
      deal_activities: {
        Row: {
          id: string
          deal_id: string
          user_id: string | null
          type: "note" | "call" | "email" | "meeting" | "status_change" | "document" | "task"
          title: string | null
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["deal_activities"]["Row"]> & { deal_id: string; type: string }
        Update: Partial<Database["public"]["Tables"]["deal_activities"]["Row"]>
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          model: string
          messages: Json
          context_type: "general" | "property" | "deal" | "trading" | "research" | null
          context_id: string | null
          tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["conversations"]["Row"]> & { user_id: string }
        Update: Partial<Database["public"]["Tables"]["conversations"]["Row"]>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          user_id: string
          type: string
          title: string
        }
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"]
export type Commission = Database["public"]["Tables"]["commissions"]["Row"]
export type TradingAccount = Database["public"]["Tables"]["trading_accounts"]["Row"]
export type Watchlist = Database["public"]["Tables"]["watchlists"]["Row"]
export type TradeOrder = Database["public"]["Tables"]["trade_orders"]["Row"]
export type Position = Database["public"]["Tables"]["positions"]["Row"]
export type TradeSignal = Database["public"]["Tables"]["trade_signals"]["Row"]
export type Property = Database["public"]["Tables"]["properties"]["Row"]
export type WholesaleDeal = Database["public"]["Tables"]["wholesale_deals"]["Row"]
export type CashBuyer = Database["public"]["Tables"]["cash_buyers"]["Row"]
export type Deal = Database["public"]["Tables"]["deals"]["Row"]
export type DealActivity = Database["public"]["Tables"]["deal_activities"]["Row"]
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
