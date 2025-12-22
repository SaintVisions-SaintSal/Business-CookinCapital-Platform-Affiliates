-- ============================================================
-- DATABASE FUNCTIONS FOR SAINTSALⓇ PLATFORM
-- ============================================================

-- Function to increment pending payout for affiliates
CREATE OR REPLACE FUNCTION increment_pending_payout(
  p_affiliate_id UUID,
  p_amount DECIMAL(12,2)
)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliates
  SET 
    pending_payout = pending_payout + p_amount,
    total_earnings = total_earnings + p_amount,
    updated_at = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process affiliate payout
CREATE OR REPLACE FUNCTION process_affiliate_payout(
  p_affiliate_id UUID,
  p_amount DECIMAL(12,2),
  p_method TEXT,
  p_stripe_transfer_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_payout_id UUID;
BEGIN
  -- Create payout record
  INSERT INTO payouts (affiliate_id, amount, method, stripe_transfer_id, status)
  VALUES (p_affiliate_id, p_amount, p_method, p_stripe_transfer_id, 'processing')
  RETURNING id INTO v_payout_id;
  
  -- Update commissions to paid
  UPDATE commissions
  SET 
    status = 'paid',
    payout_id = v_payout_id,
    paid_at = NOW()
  WHERE affiliate_id = p_affiliate_id 
    AND status = 'pending';
  
  -- Reset pending payout
  UPDATE affiliates
  SET 
    pending_payout = 0,
    updated_at = NOW()
  WHERE id = p_affiliate_id;
  
  RETURN v_payout_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete payout
CREATE OR REPLACE FUNCTION complete_payout(p_payout_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE payouts
  SET 
    status = 'completed',
    processed_at = NOW()
  WHERE id = p_payout_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update affiliate referral counts
CREATE OR REPLACE FUNCTION update_affiliate_referral_counts()
RETURNS TRIGGER AS $$
DECLARE
  v_affiliate_id UUID;
BEGIN
  -- Find the affiliate by their code
  SELECT id INTO v_affiliate_id
  FROM affiliates
  WHERE affiliate_code = NEW.referred_by;
  
  IF v_affiliate_id IS NOT NULL THEN
    -- Update lifetime referrals
    UPDATE affiliates
    SET 
      lifetime_referrals = lifetime_referrals + 1,
      active_referrals = active_referrals + 1,
      updated_at = NOW()
    WHERE id = v_affiliate_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update referral counts on new profile with referred_by
DROP TRIGGER IF EXISTS on_profile_referred ON profiles;
CREATE TRIGGER on_profile_referred
  AFTER INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referred_by IS NOT NULL)
  EXECUTE FUNCTION update_affiliate_referral_counts();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'referred_by'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code(p_name TEXT)
RETURNS TEXT AS $$
DECLARE
  v_base TEXT;
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Create base from name (first 6 chars, alphanumeric only)
  v_base := UPPER(SUBSTRING(REGEXP_REPLACE(p_name, '[^a-zA-Z0-9]', '', 'g'), 1, 6));
  
  -- Add random suffix
  LOOP
    v_code := v_base || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
    
    -- Check if code exists
    SELECT EXISTS(SELECT 1 FROM affiliates WHERE affiliate_code = v_code) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_pending_payout TO authenticated;
GRANT EXECUTE ON FUNCTION process_affiliate_payout TO authenticated;
GRANT EXECUTE ON FUNCTION complete_payout TO authenticated;
GRANT EXECUTE ON FUNCTION generate_affiliate_code TO authenticated;
