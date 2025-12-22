'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Home, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatNumber } from '@/lib/utils'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    conversations: 0,
    deals: 0,
    properties: 0,
    earnings: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      // Get stats
      const [convos, deals] = await Promise.all([
        supabase.from('conversations').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('deals').select('id', { count: 'exact' }).eq('user_id', user.id),
      ])

      setStats({
        conversations: convos.count || 0,
        deals: deals.count || 0,
        properties: 0,
        earnings: 0,
      })
    }
    loadData()
  }, [supabase])

  const quickActions = [
    {
      title: 'Chat with SaintSal™',
      description: 'Start a conversation with your AI expert',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'gold',
    },
    {
      title: 'Score a Property',
      description: 'Get instant AI analysis on any property',
      icon: Home,
      href: '/dashboard/properties',
      color: 'gold',
    },
    {
      title: 'New Deal',
      description: 'Add a deal to your pipeline',
      icon: DollarSign,
      href: '/dashboard/deals/new',
      color: 'gold',
    },
    {
      title: 'Invite & Earn',
      description: 'Share and earn 30% recurring',
      icon: Users,
      href: '/dashboard/affiliates',
      color: 'gold',
    },
  ]

  const recentActivity = [
    { type: 'chat', title: 'Property analysis completed', time: '5 min ago' },
    { type: 'deal', title: 'New lead added to pipeline', time: '1 hour ago' },
    { type: 'earning', title: 'Commission earned: $29.10', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-white/50 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <Link
          href="/dashboard/chat"
          className="btn-gold inline-flex items-center gap-2 self-start"
        >
          <Sparkles className="w-5 h-5" />
          New Chat with SaintSal™
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {[
          { label: 'AI Conversations', value: formatNumber(stats.conversations), icon: MessageSquare, change: '+12%' },
          { label: 'Active Deals', value: formatNumber(stats.deals), icon: TrendingUp, change: '+5%' },
          { label: 'Properties Scored', value: formatNumber(stats.properties), icon: Home, change: '+8%' },
          { label: 'Total Earnings', value: formatCurrency(stats.earnings), icon: DollarSign, change: '+23%' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gold-gradient mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="glass-card-hover p-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <action.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-sm text-white/50 mb-4">{action.description}</p>
              <div className="flex items-center text-gold-400 text-sm font-medium">
                Get started
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SaintSal™ Greeting */}
        <motion.div 
          className="lg:col-span-2 glass-card p-6 overflow-hidden relative"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal™"
                width={100}
                height={100}
                className="rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold-400 font-semibold">SaintSal™</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400">
                  ONLINE
                </span>
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Good to see you, {profile?.full_name?.split(' ')[0] || 'boss'}! I'm ready to help with 
                anything you need - property analysis, deal structuring, market research, 
                or just bouncing ideas. What are we tackling today?
              </p>
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center gap-2 text-gold-400 font-medium hover:text-gold-300 transition-colors"
              >
                Start a conversation
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="glass-card p-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gold-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{activity.title}</p>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/activity"
            className="block mt-4 text-center text-sm text-gold-400 hover:text-gold-300 transition-colors"
          >
            View all activity
          </Link>
        </motion.div>
      </div>

      {/* Affiliate CTA (if not already an affiliate) */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Earn 30% Recurring Commissions
              </h3>
              <p className="text-white/50">
                Share SaintSal™ and earn on every subscription. Instant same-day payouts.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/affiliates"
            className="btn-gold whitespace-nowrap"
          >
            Start Earning
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
