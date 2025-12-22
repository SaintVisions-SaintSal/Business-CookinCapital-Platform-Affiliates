"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Home,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Sparkles,
  Code,
  Briefcase,
  DollarSign,
  Building2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "SaintSal™ Chat", href: "/dashboard/chat", icon: MessageSquare, badge: "AI" },
  { name: "Code Agent", href: "/dashboard/code", icon: Code, tier: "pro" },
  { name: "Property Scoring", href: "/dashboard/properties", icon: Home },
  { name: "Real Estate", href: "/dashboard/real-estate", icon: Building2 },
  { name: "Deal Pipeline", href: "/dashboard/deals", icon: Briefcase },
  { name: "Trading", href: "/dashboard/trading", icon: TrendingUp, tier: "pro" },
  { name: "Affiliates", href: "/dashboard/affiliates", icon: Users },
  { name: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
]

const bottomNav = [{ name: "Settings", href: "/dashboard/settings", icon: Settings }]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)

      // Get profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setProfile(profile)
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f12]">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-[#0d0f12]">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-72 bg-[#0d0f12] border-r border-white/[0.06] transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/[0.06]">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="SaintSal™" width={40} height={40} />
                <div>
                  <span className="text-lg font-semibold text-gold-gradient">SaintSal™</span>
                  <div className="text-[10px] text-white/40 -mt-1">by Saint Vision</div>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{profile?.full_name || "Welcome"}</div>
                  <div className="text-xs text-gold-400 capitalize">{profile?.tier || "Free"} Plan</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const isLocked = item.tier && profile?.tier === "free"

                return (
                  <Link
                    key={item.name}
                    href={isLocked ? "/dashboard/upgrade" : item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]",
                      isLocked && "opacity-50",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-gold-400" : "text-white/40 group-hover:text-white/60",
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-500/20 text-gold-400">
                        {item.badge}
                      </span>
                    )}
                    {item.tier && (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/10 text-white/50 uppercase">
                        {item.tier}+
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-gold-400" />}
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-4 py-4 border-t border-white/[0.06] space-y-1">
              {bottomNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-white/[0.05] text-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.03]",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 h-20 bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between h-full px-6">
              {/* Mobile menu button */}
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/50 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>

              {/* Search */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/20"
                  />
                  <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] text-white/30 bg-white/[0.05] rounded border border-white/10">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Upgrade CTA */}
                {profile?.tier === "free" && (
                  <Link
                    href="/dashboard/upgrade"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 text-gold-400 text-sm font-medium hover:bg-gold-500/20 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade
                  </Link>
                )}

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
                </button>

                {/* User menu */}
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold cursor-pointer hover:ring-2 hover:ring-gold-500/30 transition-all">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
