-- Migration: Add missing columns to profiles table for referral tracking
-- SaintSal™ Affiliate Platform - Profile Enhancement

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for referred_by lookups (for affiliate tracking)
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- Create or replace the function to handle referral tracking on profile creation
CREATE OR REPLACE FUNCTION public.handle_referral_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_affiliate_id UUID;
BEGIN
  -- Only process if referred_by has a value
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by != '' THEN
    -- Find the affiliate with this code
    SELECT id INTO referrer_affiliate_id
    FROM public.affiliates
    WHERE affiliate_code = NEW.referred_by
    AND is_active = true;
    
    -- If we found an affiliate, increment their referral count
    IF referrer_affiliate_id IS NOT NULL THEN
      UPDATE public.affiliates
      SET total_referrals = COALESCE(total_referrals, 0) + 1,
          updated_at = NOW()
      WHERE id = referrer_affiliate_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_profile_referral ON public.profiles;

-- Create trigger for referral tracking
CREATE TRIGGER on_profile_referral
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_on_signup();

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
