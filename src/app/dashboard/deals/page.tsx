"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building2,
  ChevronRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatNumber, formatDate, cn } from "@/lib/utils"
import type { Deal } from "@/types/database"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const DEAL_STATUSES = {
  lead: { label: "Lead", color: "bg-blue-500/10 text-blue-400", icon: User },
  application: { label: "Application", color: "bg-purple-500/10 text-purple-400", icon: FileText },
  processing: { label: "Processing", color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
  underwriting: { label: "Underwriting", color: "bg-orange-500/10 text-orange-400", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-green-500/10 text-green-400", icon: CheckCircle },
  docs_out: { label: "Docs Out", color: "bg-teal-500/10 text-teal-400", icon: FileText },
  funded: { label: "Funded", color: "bg-emerald-500/10 text-emerald-400", icon: DollarSign },
  closed: { label: "Closed", color: "bg-green-600/10 text-green-500", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-500/10 text-red-400", icon: XCircle },
}

const LOAN_TYPES = {
  fix_flip: "Fix & Flip",
  dscr: "DSCR",
  bridge: "Bridge",
  construction: "Construction",
  conventional: "Conventional",
  fha: "FHA",
  va: "VA",
  hard_money: "Hard Money",
  private: "Private",
}

const PIPELINE_STAGES = [
  { key: "lead", label: "Leads" },
  { key: "application", label: "Application" },
  { key: "processing", label: "Processing" },
  { key: "underwriting", label: "Underwriting" },
  { key: "approved", label: "Approved" },
  { key: "funded", label: "Funded" },
  { key: "closed", label: "Closed" },
]

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [view, setView] = useState<"pipeline" | "list">("pipeline")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadDeals = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("deals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setDeals(data || [])
    }
    loadDeals()
  }, [supabase])

  // Mock deals for display
  const mockDeals: Partial<Deal>[] = [
    {
      id: "1",
      borrower_name: "John Anderson",
      borrower_email: "john@example.com",
      borrower_phone: "(555) 123-4567",
      property_address: "123 Main St, Houston, TX",
      loan_amount: 450000,
      loan_type: "fix_flip",
      status: "underwriting",
      probability: 75,
      expected_close_date: "2025-01-15",
      lead_source: "Referral",
    },
    {
      id: "2",
      borrower_name: "Sarah Williams",
      borrower_email: "sarah@example.com",
      borrower_phone: "(555) 234-5678",
      property_address: "456 Oak Ave, Dallas, TX",
      loan_amount: 285000,
      loan_type: "dscr",
      status: "approved",
      probability: 90,
      expected_close_date: "2025-01-10",
      lead_source: "Website",
    },
    {
      id: "3",
      borrower_name: "Michael Chen",
      borrower_email: "michael@example.com",
      borrower_phone: "(555) 345-6789",
      property_address: "789 Pine Rd, Austin, TX",
      loan_amount: 620000,
      loan_type: "bridge",
      status: "processing",
      probability: 60,
      expected_close_date: "2025-01-25",
      lead_source: "Cold Call",
    },
    {
      id: "4",
      borrower_name: "Emily Davis",
      borrower_email: "emily@example.com",
      borrower_phone: "(555) 456-7890",
      property_address: "321 Elm Blvd, San Antonio, TX",
      loan_amount: 175000,
      loan_type: "conventional",
      status: "lead",
      probability: 25,
      expected_close_date: "2025-02-01",
      lead_source: "Affiliate",
    },
    {
      id: "5",
      borrower_name: "Robert Martinez",
      borrower_email: "robert@example.com",
      borrower_phone: "(555) 567-8901",
      property_address: "654 Maple Dr, Fort Worth, TX",
      loan_amount: 380000,
      loan_type: "hard_money",
      status: "funded",
      probability: 95,
      expected_close_date: "2025-01-05",
      lead_source: "Referral",
    },
    {
      id: "6",
      borrower_name: "Lisa Thompson",
      borrower_email: "lisa@example.com",
      borrower_phone: "(555) 678-9012",
      property_address: "987 Cedar Ln, El Paso, TX",
      loan_amount: 520000,
      loan_type: "construction",
      status: "application",
      probability: 40,
      expected_close_date: "2025-02-15",
      lead_source: "Website",
    },
  ]

  const displayDeals = deals.length > 0 ? deals : mockDeals

  // Calculate stats
  const totalPipeline = displayDeals.reduce((sum, d) => sum + (d.loan_amount || 0), 0)
  const activeDeals = displayDeals.filter((d) => !["closed", "lost"].includes(d.status || "")).length
  const closedDeals = displayDeals.filter((d) => d.status === "closed" || d.status === "funded").length
  const avgDealSize = activeDeals > 0 ? totalPipeline / activeDeals : 0

  // Group deals by status for pipeline view
  const dealsByStatus = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage.key] = displayDeals.filter((d) => d.status === stage.key)
      return acc
    },
    {} as Record<string, typeof displayDeals>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Deal Pipeline</h1>
          <p className="text-white/50 mt-1">Manage your lending deals and track progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setView("pipeline")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                view === "pipeline" ? "bg-gold-500/20 text-gold-400" : "text-white/60 hover:text-white",
              )}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                view === "list" ? "bg-gold-500/20 text-gold-400" : "text-white/60 hover:text-white",
              )}
            >
              List
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-gold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Deal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pipeline Value", value: formatCurrency(totalPipeline), icon: DollarSign, color: "text-gold-400" },
          { label: "Active Deals", value: formatNumber(activeDeals), icon: Briefcase, color: "text-blue-400" },
          { label: "Closed/Funded", value: formatNumber(closedDeals), icon: CheckCircle, color: "text-green-400" },
          { label: "Avg Deal Size", value: formatCurrency(avgDealSize), icon: Building2, color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-5"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium pl-10 w-full"
          />
        </div>
        <button className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Pipeline View */}
      {view === "pipeline" && (
        <motion.div className="overflow-x-auto pb-4" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => {
              const stageDeals = dealsByStatus[stage.key] || []
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.loan_amount || 0), 0)

              return (
                <div key={stage.key} className="w-80 flex-shrink-0">
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{stage.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
                        {stageDeals.length}
                      </span>
                    </div>
                    <span className="text-xs text-white/40">{formatCurrency(stageValue)}</span>
                  </div>

                  {/* Stage Cards */}
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="glass-card p-4 hover:border-gold-500/30 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-white group-hover:text-gold-400 transition-colors">
                              {deal.borrower_name}
                            </h4>
                            <p className="text-xs text-white/50 mt-0.5">{deal.property_address}</p>
                          </div>
                          <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
                            <MoreVertical className="w-4 h-4 text-white/50" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg font-bold text-gold-gradient">
                            {formatCurrency(deal.loan_amount || 0)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
                            {LOAN_TYPES[deal.loan_type as keyof typeof LOAN_TYPES] || deal.loan_type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-white/40">
                            <Calendar className="w-3 h-3" />
                            {deal.expected_close_date ? formatDate(deal.expected_close_date) : "No date"}
                          </div>
                          <div
                            className={cn(
                              "px-2 py-0.5 rounded-full",
                              (deal.probability || 0) >= 75
                                ? "bg-green-500/10 text-green-400"
                                : (deal.probability || 0) >= 50
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-red-500/10 text-red-400",
                            )}
                          >
                            {deal.probability}%
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="p-8 rounded-xl border-2 border-dashed border-white/10 text-center">
                        <p className="text-sm text-white/30">No deals</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {view === "list" && (
        <motion.div className="glass-card overflow-hidden" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-white/50 border-b border-white/10">
                  <th className="p-4 font-medium">Borrower</th>
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Loan Amount</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Close Date</th>
                  <th className="p-4 font-medium">Prob.</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {displayDeals.map((deal) => {
                  const status = DEAL_STATUSES[deal.status as keyof typeof DEAL_STATUSES]
                  return (
                    <tr key={deal.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{deal.borrower_name}</div>
                          <div className="text-xs text-white/40">{deal.borrower_email}</div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/70 max-w-[200px] truncate">{deal.property_address}</td>
                      <td className="p-4">
                        <span className="font-semibold text-gold-gradient">
                          {formatCurrency(deal.loan_amount || 0)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {LOAN_TYPES[deal.loan_type as keyof typeof LOAN_TYPES] || deal.loan_type}
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", status?.color)}>
                          {status?.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white/50">
                        {deal.expected_close_date ? formatDate(deal.expected_close_date) : "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            (deal.probability || 0) >= 75
                              ? "bg-green-500/10 text-green-400"
                              : (deal.probability || 0) >= 50
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400",
                          )}
                        >
                          {deal.probability}%
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <ChevronRight className="w-4 h-4 text-white/40" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Quick Add CTA */}
      <motion.div
        className="glass-card p-6 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Import Leads from GHL</h3>
              <p className="text-white/50 text-sm">Sync your GoHighLevel contacts directly into your pipeline.</p>
            </div>
          </div>
          <button className="btn-gold whitespace-nowrap">
            Connect GHL
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
