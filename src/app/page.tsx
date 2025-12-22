'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  MessageSquare, 
  TrendingUp, 
  Home, 
  Users, 
  Zap, 
  Shield,
  ChevronRight,
  Sparkles,
  Play,
  Check
} from 'lucide-react'
import { PRICING } from '@/lib/stripe'
import { cn, formatCurrency } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/[0.08]" 
          : "bg-transparent"
      )}>
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal™"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="text-xl font-semibold text-gold-gradient">SaintSal™</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-white/70 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/affiliates" className="text-white/70 hover:text-white transition-colors">
                Affiliates
              </Link>
              <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn-gold text-sm !px-6 !py-2.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <motion.div 
          className="section-container relative z-10"
          style={{ opacity, scale }}
        >
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm">
                <Sparkles className="w-4 h-4" />
                Powered by US Patent #10,290,222
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="hero-title mb-6">
              <span className="text-white">Your AI-Powered</span>
              <br />
              <span className="text-gold-gradient">Business Intelligence</span>
              <br />
              <span className="text-white">Platform</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/60 mb-10 max-w-3xl mx-auto leading-relaxed">
              Chat with the smartest AI. Score properties. Fund deals. Trade markets. 
              All in one platform built for serious operators.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/signup" className="btn-gold flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-ghost flex items-center gap-2 group">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Hero Image/Preview */}
            <motion.div 
              variants={fadeInUp}
              className="relative mx-auto max-w-4xl"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-gold-500/20 rounded-2xl blur-xl opacity-50" />
                
                {/* Dashboard Preview */}
                <div className="relative bg-[#1a1d23] rounded-2xl p-1">
                  <div className="bg-[#0d0f12] rounded-xl overflow-hidden">
                    {/* Mock Browser Bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1d23] border-b border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-white/5 rounded-lg px-4 py-1.5 text-sm text-white/40 text-center">
                          cookinbiz.com/dashboard
                        </div>
                      </div>
                    </div>
                    
                    {/* Dashboard Content Preview */}
                    <div className="p-6 space-y-6">
                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Total Revenue', value: '$128,430' },
                          { label: 'Active Deals', value: '47' },
                          { label: 'Conversations', value: '1,284' },
                          { label: 'Affiliates', value: '23' },
                        ].map((stat, i) => (
                          <div key={i} className="glass-card p-4">
                            <div className="text-2xl font-bold text-gold-gradient">{stat.value}</div>
                            <div className="text-xs text-white/50">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Chat Preview */}
                      <div className="glass-card p-4">
                        <div className="flex items-start gap-4">
                          <Image
                            src="/images/TRANSPARENTSAINTSALLOGO.png"
                            alt="SaintSal"
                            width={40}
                            height={40}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-gold-400 mb-1">SaintSal™</div>
                            <div className="text-white/80">
                              Based on my analysis, this property at 123 Main St shows a 94% investment score. 
                              The cap rate of 7.2% is above market average, and the neighborhood growth indicators are strong...
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-gold-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="section-container">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">
              <span className="text-white">Everything You Need.</span>
              <br />
              <span className="text-gold-gradient">One Platform.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Stop juggling tools. SaintSal™ brings AI chat, property analysis, deal flow, 
              and trading into one powerful interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'AI Chat',
                description: 'Chat with multiple AI models including GPT-4, Claude, Gemini, and Grok. Voice enabled.',
                color: 'gold',
              },
              {
                icon: Home,
                title: 'Property Scoring',
                description: 'Instant AI-powered property analysis with investment scores and market insights.',
                color: 'gold',
              },
              {
                icon: TrendingUp,
                title: 'Deal Pipeline',
                description: 'Full lending portal with document management and deal tracking.',
                color: 'gold',
              },
              {
                icon: Zap,
                title: 'Trading Platform',
                description: 'Execute trades with Alpaca integration. Real-time market data.',
                color: 'gold',
              },
              {
                icon: Users,
                title: 'Affiliate Program',
                description: '30% recurring commissions with instant same-day payouts via Stripe.',
                color: 'gold',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption, SOC 2 compliant infrastructure.',
                color: 'gold',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card-hover p-8 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
                <div className="mt-6 flex items-center text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">
              <span className="text-white">Simple, Transparent</span>
              <br />
              <span className="text-gold-gradient">Pricing</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Object.entries(PRICING).slice(0, 4).map(([key, plan], i) => (
              <motion.div
                key={key}
                className={cn(
                  "glass-card p-8 relative",
                  'popular' in plan && plan.popular && "border-gold-500/50 ring-2 ring-gold-500/20"
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-500 text-black text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="text-lg font-semibold text-white mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-gold-gradient">
                    {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                  </span>
                  {plan.price > 0 && <span className="text-white/40">/mo</span>}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/signup?plan=${key}`}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
                    'popular' in plan && plan.popular
                      ? "btn-gold"
                      : "btn-ghost"
                  )}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="section-container">
          <motion.div 
            className="relative glass-card p-16 text-center overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />
            
            <div className="relative z-10">
              <h2 className="section-title mb-6">
                <span className="text-white">Ready to Start</span>
                <br />
                <span className="text-gold-gradient">Cookin'?</span>
              </h2>
              <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
                Join thousands of operators using SaintSal™ to supercharge their business.
              </p>
              <Link href="/signup" className="btn-gold inline-flex items-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/[0.08]">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal™"
                width={40}
                height={40}
              />
              <div>
                <div className="font-semibold text-gold-gradient">SaintSal™</div>
                <div className="text-xs text-white/40">by Saint Vision Technologies</div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-white/50">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/affiliates" className="hover:text-white transition-colors">Affiliates</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="text-sm text-white/30">
              © 2025 Saint Vision Technologies LLC
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
