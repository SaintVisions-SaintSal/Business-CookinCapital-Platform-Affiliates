export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: string
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          affiliate_code: string
          stripe_connect_id: string | null
          total_referrals: number
          total_earnings: number
          pending_earnings: number
          status: string
          tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          affiliate_code: string
          stripe_connect_id?: string | null
          total_referrals?: number
          total_earnings?: number
          pending_earnings?: number
          status?: string
          tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          affiliate_code?: string
          stripe_connect_id?: string | null
          total_referrals?: number
          total_earnings?: number
          pending_earnings?: number
          status?: string
          tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          affiliate_id: string
          referred_user_id: string
          status: string
          subscription_tier: string | null
          commission_rate: number
          created_at: string
          converted_at: string | null
        }
        Insert: {
          id?: string
          affiliate_id: string
          referred_user_id: string
          status?: string
          subscription_tier?: string | null
          commission_rate?: number
          created_at?: string
          converted_at?: string | null
        }
        Update: {
          id?: string
          affiliate_id?: string
          referred_user_id?: string
          status?: string
          subscription_tier?: string | null
          commission_rate?: number
          created_at?: string
          converted_at?: string | null
        }
      }
      commissions: {
        Row: {
          id: string
          affiliate_id: string
          referral_id: string
          amount: number
          status: string
          stripe_transfer_id: string | null
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          affiliate_id: string
          referral_id: string
          amount: number
          status?: string
          stripe_transfer_id?: string | null
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          affiliate_id?: string
          referral_id?: string
          amount?: number
          status?: string
          stripe_transfer_id?: string | null
          created_at?: string
          paid_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_id: string
          amount: number
          status: string
          subscription_tier: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_id: string
          amount: number
          status?: string
          subscription_tier: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_id?: string
          amount?: number
          status?: string
          subscription_tier?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          address: string
          city: string
          state: string
          zip: string
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          sqft: number | null
          arv: number | null
          asking_price: number | null
          repair_cost: number | null
          mao: number | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          city: string
          state: string
          zip: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          arv?: number | null
          asking_price?: number | null
          repair_cost?: number | null
          mao?: number | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          arv?: number | null
          asking_price?: number | null
          repair_cost?: number | null
          mao?: number | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          title: string
          deal_type: string
          status: string
          potential_profit: number | null
          actual_profit: number | null
          notes: string | null
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          title: string
          deal_type?: string
          status?: string
          potential_profit?: number | null
          actual_profit?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          title?: string
          deal_type?: string
          status?: string
          potential_profit?: number | null
          actual_profit?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
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
