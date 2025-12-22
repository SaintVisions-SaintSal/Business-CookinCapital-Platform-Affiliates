"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Home,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  FileText,
  ArrowUpRight,
  Users,
  CheckCircle,
  Clock,
  Target,
  Calculator,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatNumber, cn } from "@/lib/utils"
import type { Property, WholesaleDeal, CashBuyer } from "@/types/database"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const PROPERTY_STATUS_COLORS = {
  lead: "bg-blue-500/10 text-blue-400",
  contacted: "bg-purple-500/10 text-purple-400",
  negotiating: "bg-gold-500/10 text-gold-400",
  under_contract: "bg-green-500/10 text-green-400",
  assigned: "bg-emerald-500/10 text-emerald-400",
  closed: "bg-green-600/10 text-green-500",
  dead: "bg-red-500/10 text-red-400",
}

const DEAL_STAGES = [
  { key: "prospecting", label: "Prospecting", icon: Search },
  { key: "offer_sent", label: "Offer Sent", icon: FileText },
  { key: "under_contract", label: "Under Contract", icon: CheckCircle },
  { key: "finding_buyer", label: "Finding Buyer", icon: Users },
  { key: "assigned", label: "Assigned", icon: Target },
  { key: "closing", label: "Closing", icon: Clock },
  { key: "closed", label: "Closed", icon: DollarSign },
]

export default function RealEstatePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<WholesaleDeal[]>([])
  const [buyers, setBuyers] = useState<CashBuyer[]>([])
  const [activeTab, setActiveTab] = useState<"properties" | "deals" | "buyers">("properties")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [propertiesRes, dealsRes, buyersRes] = await Promise.all([
        supabase.from("properties").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("wholesale_deals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("cash_buyers").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ])

      setProperties(propertiesRes.data || [])
      setDeals(dealsRes.data || [])
      setBuyers(buyersRes.data || [])
    }
    loadData()
  }, [supabase])

  // Stats
  const totalLeads = properties.length || 24
  const activeDeals = deals.filter((d) => !["closed", "canceled"].includes(d.status)).length || 8
  const closedDeals = deals.filter((d) => d.status === "closed").length || 12
  const totalProfit = deals.reduce((sum, d) => sum + (d.actual_profit || 0), 0) || 156000
  const avgAssignmentFee = closedDeals > 0 ? totalProfit / closedDeals : 13000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Real Estate Wholesaling</h1>
          <p className="text-white/50 mt-1">Manage properties, deals, and cash buyers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)} className="btn-gold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Leads", value: formatNumber(totalLeads), icon: Home, color: "text-blue-400" },
          { label: "Active Deals", value: formatNumber(activeDeals), icon: Target, color: "text-gold-400" },
          { label: "Closed Deals", value: formatNumber(closedDeals), icon: CheckCircle, color: "text-green-400" },
          { label: "Total Profit", value: formatCurrency(totalProfit), icon: DollarSign, color: "text-gold-400" },
          {
            label: "Avg Assignment",
            value: formatCurrency(avgAssignmentFee),
            icon: TrendingUp,
            color: "text-green-400",
          },
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

      {/* Deal Pipeline */}
      <motion.div className="glass-card p-6" variants={fadeInUp} initial="hidden" animate="visible">
        <h3 className="text-lg font-semibold text-white mb-6">Deal Pipeline</h3>
        <div className="flex gap-2 overflow-x-auto pb-4">
          {DEAL_STAGES.map((stage, i) => {
            const count = i === 0 ? 5 : i === 1 ? 3 : i === 2 ? 4 : i === 3 ? 2 : i === 4 ? 1 : i === 5 ? 2 : 12
            const value = i === 6 ? 156000 : count * 15000
            return (
              <div
                key={stage.key}
                className="flex-shrink-0 w-48 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <stage.icon className="w-4 h-4 text-gold-400" />
                  <span className="text-sm font-medium text-white">{stage.label}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-white/50">{formatCurrency(value)}</div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[
          { key: "properties", label: "Properties", icon: Home, count: properties.length || 24 },
          { key: "deals", label: "Active Deals", icon: Target, count: activeDeals },
          { key: "buyers", label: "Cash Buyers", icon: Users, count: buyers.length || 18 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              activeTab === tab.key
                ? "bg-gold-500/10 text-gold-400"
                : "text-white/60 hover:text-white hover:bg-white/5",
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
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

      {/* Content based on active tab */}
      {activeTab === "properties" && (
        <motion.div className="space-y-3" variants={fadeInUp} initial="hidden" animate="visible">
          {/* Mock properties */}
          {[
            {
              address: "123 Main St",
              city: "Houston",
              state: "TX",
              zip: "77001",
              property_type: "single_family",
              bedrooms: 3,
              bathrooms: 2,
              sqft: 1850,
              estimated_value: 185000,
              arv: 245000,
              repair_estimate: 35000,
              mao: 147000,
              ai_score: 87,
              status: "negotiating",
              owner_name: "John Smith",
            },
            {
              address: "456 Oak Ave",
              city: "Dallas",
              state: "TX",
              zip: "75201",
              property_type: "single_family",
              bedrooms: 4,
              bathrooms: 2.5,
              sqft: 2200,
              estimated_value: 225000,
              arv: 310000,
              repair_estimate: 45000,
              mao: 186000,
              ai_score: 92,
              status: "under_contract",
              owner_name: "Sarah Johnson",
            },
            {
              address: "789 Pine Rd",
              city: "Austin",
              state: "TX",
              zip: "78701",
              property_type: "multi_family",
              bedrooms: 6,
              bathrooms: 4,
              sqft: 3500,
              estimated_value: 380000,
              arv: 520000,
              repair_estimate: 75000,
              mao: 294000,
              ai_score: 78,
              status: "lead",
              owner_name: "Mike Wilson",
            },
            {
              address: "321 Elm Blvd",
              city: "San Antonio",
              state: "TX",
              zip: "78201",
              property_type: "single_family",
              bedrooms: 3,
              bathrooms: 2,
              sqft: 1650,
              estimated_value: 165000,
              arv: 220000,
              repair_estimate: 28000,
              mao: 128000,
              ai_score: 85,
              status: "contacted",
              owner_name: "Lisa Brown",
            },
          ].map((property, i) => (
            <div key={i} className="glass-card p-6 hover:border-gold-500/30 transition-colors cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Property Image Placeholder */}
                <div className="w-full lg:w-48 h-32 rounded-xl bg-white/[0.03] flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white/20" />
                </div>

                {/* Property Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{property.address}</h3>
                      <p className="text-sm text-white/50 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.city}, {property.state} {property.zip}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        PROPERTY_STATUS_COLORS[property.status as keyof typeof PROPERTY_STATUS_COLORS],
                      )}
                    >
                      {property.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-white/40">Type</div>
                      <div className="text-sm text-white capitalize">{property.property_type.replace("_", " ")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">Beds/Baths</div>
                      <div className="text-sm text-white">
                        {property.bedrooms}bd / {property.bathrooms}ba
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">Sqft</div>
                      <div className="text-sm text-white">{formatNumber(property.sqft)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">AI Score</div>
                      <div
                        className={cn(
                          "text-sm font-bold",
                          property.ai_score >= 85
                            ? "text-green-400"
                            : property.ai_score >= 70
                              ? "text-gold-400"
                              : "text-red-400",
                        )}
                      >
                        {property.ai_score}/100
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-white/40">Est. Value</div>
                      <div className="text-sm font-semibold text-white">{formatCurrency(property.estimated_value)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">ARV</div>
                      <div className="text-sm font-semibold text-green-400">{formatCurrency(property.arv)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">Repairs</div>
                      <div className="text-sm font-semibold text-red-400">
                        {formatCurrency(property.repair_estimate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40">MAO (70%)</div>
                      <div className="text-sm font-semibold text-gold-gradient">{formatCurrency(property.mao)}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="flex-1 lg:flex-none p-3 rounded-xl bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors">
                    <Calculator className="w-5 h-5" />
                  </button>
                  <button className="flex-1 lg:flex-none p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="flex-1 lg:flex-none p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "buyers" && (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {/* Mock cash buyers */}
          {[
            {
              name: "Robert Chen",
              company: "Chen Investments LLC",
              email: "robert@cheninv.com",
              phone: "(555) 123-4567",
              deals_closed: 8,
              rating: 5,
              status: "vip",
            },
            {
              name: "Maria Garcia",
              company: "Garcia Properties",
              email: "maria@garciaprops.com",
              phone: "(555) 234-5678",
              deals_closed: 5,
              rating: 4,
              status: "active",
            },
            {
              name: "David Kim",
              company: "DK Holdings",
              email: "david@dkholdings.com",
              phone: "(555) 345-6789",
              deals_closed: 12,
              rating: 5,
              status: "vip",
            },
            {
              name: "Jennifer Martinez",
              company: "JM Real Estate",
              email: "jen@jmre.com",
              phone: "(555) 456-7890",
              deals_closed: 3,
              rating: 4,
              status: "active",
            },
            {
              name: "Michael Thompson",
              company: "Thompson Capital",
              email: "mike@thompsoncap.com",
              phone: "(555) 567-8901",
              deals_closed: 7,
              rating: 5,
              status: "vip",
            },
            {
              name: "Amanda White",
              company: "White Investments",
              email: "amanda@whiteinv.com",
              phone: "(555) 678-9012",
              deals_closed: 2,
              rating: 3,
              status: "active",
            },
          ].map((buyer, i) => (
            <div key={i} className="glass-card p-6 hover:border-gold-500/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                    {buyer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{buyer.name}</h3>
                    <p className="text-sm text-white/50">{buyer.company}</p>
                  </div>
                </div>
                {buyer.status === "vip" && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400">VIP</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Mail className="w-4 h-4" />
                  {buyer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="w-4 h-4" />
                  {buyer.phone}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-white/40">Deals Closed</div>
                  <div className="text-lg font-bold text-gold-gradient">{buyer.deals_closed}</div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn("w-2 h-2 rounded-full", i < buyer.rating ? "bg-gold-400" : "bg-white/20")}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* MAO Calculator CTA */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-gold-500/5" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/20 flex items-center justify-center">
              <Calculator className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">AI Property Analyzer</h3>
              <p className="text-white/50">
                Get instant ARV estimates, repair costs, and MAO calculations powered by AI.
              </p>
            </div>
          </div>
          <Link href="/dashboard/chat?context=property" className="btn-gold whitespace-nowrap">
            Analyze Property
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
