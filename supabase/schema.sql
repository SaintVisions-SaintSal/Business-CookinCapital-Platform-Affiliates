-- ============================================================
-- SAINTSAL™ / COOKINBIZ DATABASE SCHEMA
-- Saint Vision Technologies LLC
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles readable" ON public.profiles
  FOR SELECT USING (true);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- AFFILIATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'jr' CHECK (tier IN ('jr', 'vp')),
  commission_rate DECIMAL(5,4) DEFAULT 0.30,
  override_rate DECIMAL(5,4) DEFAULT NULL,
  vp_id UUID REFERENCES public.affiliates(id),
  total_earnings DECIMAL(12,2) DEFAULT 0,
  pending_payout DECIMAL(12,2) DEFAULT 0,
  stripe_connect_id TEXT,
  paypal_email TEXT,
  payout_method TEXT DEFAULT 'stripe' CHECK (payout_method IN ('stripe', 'paypal', 'wise')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate data" ON public.affiliates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate data" ON public.affiliates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affiliate" ON public.affiliates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- COMMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount DECIMAL(12,2) NOT NULL,
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'override')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled')),
  paid_at TIMESTAMPTZ,
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own commissions" ON public.commissions
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

-- ============================================================
-- DEALS TABLE (Lending Pipeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_address TEXT,
  property_type TEXT,
  property_value DECIMAL(15,2),
  loan_amount DECIMAL(15,2),
  loan_type TEXT,
  loan_purpose TEXT,
  interest_rate DECIMAL(5,4),
  term_months INTEGER,
  borrower_name TEXT,
  borrower_email TEXT,
  borrower_phone TEXT,
  credit_score INTEGER,
  status TEXT DEFAULT 'lead' CHECK (status IN (
    'lead', 'application', 'processing', 'underwriting', 
    'approved', 'funded', 'closed', 'lost'
  )),
  stage INTEGER DEFAULT 1,
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,
  documents JSONB DEFAULT '[]',
  ghl_opportunity_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deals" ON public.deals
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create deals" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals" ON public.deals
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- ============================================================
-- CONVERSATIONS TABLE (AI Chat)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  model TEXT DEFAULT 'gpt-4',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PROPERTY SCORES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.property_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  property_type TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  analysis JSONB,
  market_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores" ON public.property_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create scores" ON public.property_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- USAGE TRACKING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature, period_start)
);

ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Calculate commission on new subscription
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  referrer_code TEXT;
  affiliate_record RECORD;
  vp_record RECORD;
  commission_amount DECIMAL;
  subscription_amount DECIMAL;
BEGIN
  -- Get the referred_by code for this user
  SELECT referred_by INTO referrer_code
  FROM public.profiles
  WHERE id = NEW.user_id;

  IF referrer_code IS NOT NULL THEN
    -- Get affiliate by code
    SELECT * INTO affiliate_record
    FROM public.affiliates
    WHERE affiliate_code = referrer_code AND status = 'active';

    IF affiliate_record IS NOT NULL THEN
      -- Calculate subscription amount based on plan
      subscription_amount := CASE NEW.plan
        WHEN 'starter' THEN 27
        WHEN 'pro' THEN 97
        WHEN 'teams' THEN 297
        WHEN 'enterprise' THEN 497
        ELSE 0
      END;

      -- Calculate direct commission (30%)
      commission_amount := subscription_amount * affiliate_record.commission_rate;

      -- Create commission record
      INSERT INTO public.commissions (affiliate_id, subscription_id, amount, type)
      VALUES (affiliate_record.id, NEW.id, commission_amount, 'direct');

      -- Update affiliate earnings
      UPDATE public.affiliates
      SET pending_payout = pending_payout + commission_amount
      WHERE id = affiliate_record.id;

      -- If affiliate has a VP, create override commission (15%)
      IF affiliate_record.vp_id IS NOT NULL THEN
        SELECT * INTO vp_record
        FROM public.affiliates
        WHERE id = affiliate_record.vp_id AND status = 'active';

        IF vp_record IS NOT NULL AND vp_record.override_rate IS NOT NULL THEN
          commission_amount := subscription_amount * vp_record.override_rate;

          INSERT INTO public.commissions (affiliate_id, subscription_id, amount, type)
          VALUES (vp_record.id, NEW.id, commission_amount, 'override');

          UPDATE public.affiliates
          SET pending_payout = pending_payout + commission_amount
          WHERE id = vp_record.id;
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_created
  AFTER INSERT ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON public.profiles(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_vp_id ON public.affiliates(vp_id);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON public.commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_property_scores_user_id ON public.property_scores(user_id);

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
