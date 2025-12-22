-- ============================================================
-- SAINTSALⓇ / COOKINBIZ FULL DATABASE SCHEMA
-- Complete Trading, Real Estate, and Affiliate Platform
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE USER TABLES
-- ============================================================

-- Profiles (enhanced)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'affiliate', 'vp', 'admin')),
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'teams', 'enterprise')),
  stripe_customer_id TEXT,
  ghl_contact_id TEXT,
  affiliate_code TEXT UNIQUE,
  referred_by TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  ghl_subscription_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'teams', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AFFILIATE SYSTEM TABLES
-- ============================================================

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'jr' CHECK (tier IN ('jr', 'vp')),
  commission_rate DECIMAL(5,4) DEFAULT 0.30,
  override_rate DECIMAL(5,4) DEFAULT 0.15,
  vp_id UUID REFERENCES affiliates(id),
  total_earnings DECIMAL(12,2) DEFAULT 0,
  pending_payout DECIMAL(12,2) DEFAULT 0,
  lifetime_referrals INTEGER DEFAULT 0,
  active_referrals INTEGER DEFAULT 0,
  stripe_connect_id TEXT,
  paypal_email TEXT,
  payout_method TEXT DEFAULT 'stripe' CHECK (payout_method IN ('stripe', 'paypal', 'wise', 'bank')),
  bank_account_last4 TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  referral_user_id UUID REFERENCES profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'override', 'bonus')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'canceled')),
  payout_id UUID,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRADING PLATFORM TABLES
-- ============================================================

-- Trading Accounts (Alpaca, etc.)
CREATE TABLE IF NOT EXISTS trading_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'alpaca' CHECK (provider IN ('alpaca', 'tradier', 'ibkr', 'paper')),
  account_id TEXT,
  account_type TEXT DEFAULT 'paper' CHECK (account_type IN ('paper', 'live')),
  api_key_encrypted TEXT,
  api_secret_encrypted TEXT,
  buying_power DECIMAL(15,2) DEFAULT 0,
  cash DECIMAL(15,2) DEFAULT 0,
  portfolio_value DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  symbols TEXT[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade Orders
CREATE TABLE IF NOT EXISTS trade_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trading_account_id UUID REFERENCES trading_accounts(id),
  external_order_id TEXT,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  quantity DECIMAL(15,6) NOT NULL,
  limit_price DECIMAL(15,4),
  stop_price DECIMAL(15,4),
  filled_quantity DECIMAL(15,6) DEFAULT 0,
  filled_avg_price DECIMAL(15,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'accepted', 'filled', 'partially_filled', 'canceled', 'rejected')),
  time_in_force TEXT DEFAULT 'day' CHECK (time_in_force IN ('day', 'gtc', 'ioc', 'fok')),
  submitted_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trading_account_id UUID REFERENCES trading_accounts(id),
  symbol TEXT NOT NULL,
  quantity DECIMAL(15,6) NOT NULL,
  avg_entry_price DECIMAL(15,4) NOT NULL,
  current_price DECIMAL(15,4),
  market_value DECIMAL(15,2),
  unrealized_pl DECIMAL(15,2),
  unrealized_pl_percent DECIMAL(8,4),
  side TEXT DEFAULT 'long' CHECK (side IN ('long', 'short')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trading_account_id, symbol)
);

-- Trade Signals / Alerts
CREATE TABLE IF NOT EXISTS trade_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('buy', 'sell', 'hold', 'watch')),
  source TEXT DEFAULT 'ai' CHECK (source IN ('ai', 'technical', 'fundamental', 'manual')),
  confidence DECIMAL(5,2),
  target_price DECIMAL(15,4),
  stop_loss DECIMAL(15,4),
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REAL ESTATE / WHOLESALING TABLES
-- ============================================================

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  county TEXT,
  property_type TEXT DEFAULT 'single_family' CHECK (property_type IN ('single_family', 'multi_family', 'condo', 'townhouse', 'land', 'commercial', 'mixed_use')),
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  sqft INTEGER,
  lot_size DECIMAL(10,2),
  year_built INTEGER,
  -- Valuation
  estimated_value DECIMAL(15,2),
  arv DECIMAL(15,2), -- After Repair Value
  repair_estimate DECIMAL(15,2),
  mao DECIMAL(15,2), -- Max Allowable Offer
  -- Owner Info
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  mailing_address TEXT,
  -- Status
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'contacted', 'negotiating', 'under_contract', 'assigned', 'closed', 'dead')),
  lead_source TEXT,
  -- AI Analysis
  ai_score INTEGER,
  ai_analysis JSONB,
  -- Images/Docs
  images TEXT[],
  documents JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wholesale Deals
CREATE TABLE IF NOT EXISTS wholesale_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  -- Purchase
  purchase_price DECIMAL(15,2),
  earnest_money DECIMAL(15,2),
  inspection_period INTEGER DEFAULT 10,
  closing_date DATE,
  -- Assignment
  assignment_fee DECIMAL(15,2),
  buyer_id UUID,
  buyer_name TEXT,
  buyer_phone TEXT,
  buyer_email TEXT,
  -- Financials
  expected_profit DECIMAL(15,2),
  actual_profit DECIMAL(15,2),
  -- Status
  status TEXT DEFAULT 'prospecting' CHECK (status IN ('prospecting', 'offer_sent', 'under_contract', 'finding_buyer', 'assigned', 'closing', 'closed', 'canceled')),
  stage INTEGER DEFAULT 1,
  -- Documents
  purchase_contract_url TEXT,
  assignment_contract_url TEXT,
  title_company TEXT,
  closing_attorney TEXT,
  -- Timeline
  offer_date DATE,
  contract_date DATE,
  assignment_date DATE,
  closed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cash Buyers List
CREATE TABLE IF NOT EXISTS cash_buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  buying_criteria JSONB, -- {areas: [], property_types: [], price_range: {min, max}}
  deals_closed INTEGER DEFAULT 0,
  last_purchase_date DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LENDING / DEAL PIPELINE TABLES
-- ============================================================

-- Deals (Enhanced CRM)
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  -- Contact Info
  borrower_name TEXT,
  borrower_email TEXT,
  borrower_phone TEXT,
  -- Property
  property_address TEXT,
  property_type TEXT,
  -- Loan Details
  loan_amount DECIMAL(15,2),
  loan_type TEXT CHECK (loan_type IN ('fix_flip', 'dscr', 'bridge', 'construction', 'conventional', 'fha', 'va', 'hard_money', 'private')),
  interest_rate DECIMAL(5,3),
  term_months INTEGER,
  ltv DECIMAL(5,2),
  -- Status
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'application', 'processing', 'underwriting', 'approved', 'docs_out', 'funded', 'closed', 'lost')),
  stage INTEGER DEFAULT 1,
  probability INTEGER DEFAULT 10,
  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  -- Dates
  expected_close_date DATE,
  actual_close_date DATE,
  -- Documents
  documents JSONB,
  -- Notes & Activity
  notes TEXT,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  next_follow_up DATE,
  -- Source
  lead_source TEXT,
  referrer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal Activities
CREATE TABLE IF NOT EXISTS deal_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('note', 'call', 'email', 'meeting', 'status_change', 'document', 'task')),
  title TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI CONVERSATIONS
-- ============================================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  model TEXT DEFAULT 'gpt-4',
  messages JSONB DEFAULT '[]',
  context_type TEXT CHECK (context_type IN ('general', 'property', 'deal', 'trading', 'research')),
  context_id UUID,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS & ACTIVITY
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON profiles(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_trade_orders_user_id ON trade_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_wholesale_deals_user_id ON wholesale_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trading accounts: Users can manage their own
CREATE POLICY "Users can manage own trading accounts" ON trading_accounts FOR ALL USING (auth.uid() = user_id);

-- Positions: Users can view their own
CREATE POLICY "Users can view own positions" ON positions FOR ALL USING (auth.uid() = user_id);

-- Trade orders: Users can manage their own
CREATE POLICY "Users can manage own orders" ON trade_orders FOR ALL USING (auth.uid() = user_id);

-- Watchlists: Users can manage their own
CREATE POLICY "Users can manage own watchlists" ON watchlists FOR ALL USING (auth.uid() = user_id);

-- Properties: Users can manage their own
CREATE POLICY "Users can manage own properties" ON properties FOR ALL USING (auth.uid() = user_id);

-- Wholesale deals: Users can manage their own
CREATE POLICY "Users can manage own wholesale deals" ON wholesale_deals FOR ALL USING (auth.uid() = user_id);

-- Cash buyers: Users can manage their own
CREATE POLICY "Users can manage own cash buyers" ON cash_buyers FOR ALL USING (auth.uid() = user_id);

-- Deals: Users can manage their own
CREATE POLICY "Users can manage own deals" ON deals FOR ALL USING (auth.uid() = user_id);

-- Affiliates: Users can view their own
CREATE POLICY "Users can view own affiliate" ON affiliates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own affiliate" ON affiliates FOR UPDATE USING (auth.uid() = user_id);

-- Commissions: Users can view their own
CREATE POLICY "Users can view own commissions" ON commissions FOR SELECT 
USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Conversations: Users can manage their own
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users can manage their own
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
