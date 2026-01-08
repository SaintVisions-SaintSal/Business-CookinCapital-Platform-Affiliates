import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  LogOut,
  MessageSquare,
  TrendingUp,
  Building2,
  DollarSign,
  Landmark,
  HelpCircle,
} from "lucide-react"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/chat", icon: MessageSquare, label: "SaintSal™ AI" },
    { href: "/dashboard/trading", icon: TrendingUp, label: "Investments" },
    { href: "/dashboard/real-estate", icon: Building2, label: "Real Estate" },
    { href: "/dashboard/lending", icon: Landmark, label: "Lending" },
    { href: "/dashboard/affiliates", icon: Users, label: "Partner Portal" },
    { href: "/dashboard/earnings", icon: DollarSign, label: "Commissions" },
    { href: "/dashboard/help", icon: HelpCircle, label: "Help Center" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900/50 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img
              src="/images/transparentsaintsallogo.png"
              alt="SaintSal™"
              className="w-10 h-10 drop-shadow-[0_0_10px_rgba(212,161,6,0.4)]"
            />
            <span className="text-[#d4a106] font-bold text-lg font-serif">
              SaintSal<sup className="text-white text-xs ml-0.5">™</sup>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#d4a106]/20 flex items-center justify-center">
              <span className="text-[#d4a106] text-sm font-semibold">{user.email?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
