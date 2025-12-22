'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Github, Chrome, Check, Sparkles, Zap, TrendingUp, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PRICING } from '@/lib/stripe'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = (searchParams.get('plan') || 'free') as keyof typeof PRICING
  const referralCode = searchParams.get('ref')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const plan = PRICING[selectedPlan] || PRICING.free

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            referred_by: referralCode,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: name,
            tier: selectedPlan,
            referred_by: referralCode,
          })

        if (profileError) {
          console.error('Profile error:', profileError)
        }

        toast.success('Account created! Check your email to verify.')
        
        // If paid plan, redirect to checkout
        if (plan.price > 0) {
          router.push(`/checkout?plan=${selectedPlan}`)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?plan=${selectedPlan}`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  // Value propositions that make the subscription WORTH EVERYTHING
  const valueProps = [
    { icon: MessageSquare, text: 'SaintSal™ AI - IQ 157 Expert in EVERYTHING' },
    { icon: TrendingUp, text: 'Full Lending Portal & Deal Pipeline' },
    { icon: Zap, text: 'Unlimited GHL CRM & Automation' },
    { icon: Sparkles, text: 'Property Scoring & Market Intel' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image
              src="/images/TRANSPARENTSAINTSALLOGO.png"
              alt="SaintSal™"
              width={48}
              height={48}
            />
            <span className="text-2xl font-semibold text-gold-gradient">SaintSal™</span>
          </Link>

          {/* Selected Plan Badge */}
          <div className="mb-6">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              plan.price === 0 
                ? "bg-white/10 text-white/80" 
                : "bg-gold-500/20 text-gold-400 border border-gold-500/30"
            )}>
              <Sparkles className="w-4 h-4" />
              {plan.name} Plan {plan.price > 0 && `- $${plan.price}/mo`}
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-white/50">
              {plan.price === 0 
                ? "Start free, upgrade anytime" 
                : "Get instant access to the full platform"}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0d0f12] text-white/40">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium pl-12"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-12"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </div>

            {referralCode && (
              <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                <p className="text-sm text-gold-400">
                  🎉 Referral code <span className="font-mono font-bold">{referralCode}</span> applied!
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {plan.price > 0 ? 'Continue to Payment' : 'Create Free Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-xs text-white/40 text-center">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-gold-400 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-gold-400 hover:underline">Privacy Policy</Link>
          </p>

          {/* Sign in link */}
          <p className="mt-6 text-center text-white/50">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Value Proposition */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#0d0f12] to-[#1a1d23] border-l border-white/5">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-gold-400/10 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
          {/* Main Value Prop */}
          <div className="mb-12">
            <Image
              src="/images/TRANSPARENTSAINTSALLOGO.png"
              alt="SaintSal"
              width={80}
              height={80}
              className="mb-6"
            />
            <h2 className="text-4xl font-bold text-white mb-4">
              The Platform That<br />
              <span className="text-gold-gradient">Changes Everything</span>
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Saint Vision Technologies gives you EVERYTHING you need in business and life to be successful.
              Two platforms. Unlimited potential. One subscription.
            </p>
          </div>

          {/* Value Props List */}
          <div className="space-y-4 mb-12">
            {valueProps.map((prop, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                  <prop.icon className="w-5 h-5 text-gold-400" />
                </div>
                <span className="text-white/80 font-medium">{prop.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial/Social Proof */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                JR
              </div>
              <div>
                <p className="text-white/80 italic mb-2">
                  "SaintSal™ helped me close 3 deals in my first week. The AI knows EVERYTHING about lending, 
                  real estate, and business strategy. It's like having a Goldman Sachs exec in my pocket."
                </p>
                <p className="text-sm text-gold-400 font-medium">JR - VP Director of Lending</p>
              </div>
            </div>
          </div>

          {/* Price comparison */}
          <div className="mt-8 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
            <p className="text-sm text-gold-400 text-center">
              <span className="font-bold">$10,000+/month</span> value for just{' '}
              <span className="font-bold">${plan.price || 0}/month</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
