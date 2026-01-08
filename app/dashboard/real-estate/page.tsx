"use client"

import { useState, Suspense } from "react"
import {
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Calculator,
  Home,
  Plus,
  Search,
  X,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react"

function RealEstateContent() {
  const [activeTab, setActiveTab] = useState("deals")
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Calculator state
  const [arvInput, setArvInput] = useState("")
  const [repairsInput, setRepairsInput] = useState("")
  const [maoResult, setMaoResult] = useState<number | null>(null)

  // New deal form
  const [newDeal, setNewDeal] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    arv: "",
    askingPrice: "",
    repairCost: "",
    notes: "",
  })

  interface Deal {
    id: string
    address: string
    city: string
    state: string
    zip: string
    arv: number
    askingPrice: number
    repairCost: number
    mao: number
    profit: number
    status: "Active" | "Under Contract" | "Closed" | "Lost"
    notes: string
    createdAt: Date
  }

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      address: "123 Main St",
      city: "Houston",
      state: "TX",
      zip: "77001",
      arv: 250000,
      askingPrice: 150000,
      repairCost: 35000,
      mao: 140000,
      profit: 25000,
      status: "Active",
      notes: "Motivated seller, needs quick close",
      createdAt: new Date(),
    },
    {
      id: "2",
      address: "456 Oak Ave",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      arv: 320000,
      askingPrice: 180000,
      repairCost: 45000,
      mao: 179000,
      profit: 35000,
      status: "Under Contract",
      notes: "Closing in 2 weeks",
      createdAt: new Date(),
    },
  ])

  const calculateMAO = (arv: number, repairs: number) => arv * 0.7 - repairs

  const handleCalculate = () => {
    const arv = Number.parseFloat(arvInput) || 0
    const repairs = Number.parseFloat(repairsInput) || 0
    setMaoResult(calculateMAO(arv, repairs))
  }

  const handleSearchProperty = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)

    // Simulate property search - in production this would call PropertyRadar API
    setTimeout(() => {
      setSearchResults([
        {
          address: searchQuery,
          city: "Houston",
          state: "TX",
          zip: "77001",
          estimatedValue: 285000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          yearBuilt: 1985,
          lotSize: "6,500 sqft",
        },
      ])
      setIsSearching(false)
    }, 1500)
  }

  const handleSelectProperty = (property: any) => {
    setNewDeal({
      ...newDeal,
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      arv: property.estimatedValue.toString(),
    })
    setSearchResults([])
    setSearchQuery("")
  }

  const handleSaveDeal = () => {
    const arv = Number.parseFloat(newDeal.arv) || 0
    const askingPrice = Number.parseFloat(newDeal.askingPrice) || 0
    const repairCost = Number.parseFloat(newDeal.repairCost) || 0
    const mao = calculateMAO(arv, repairCost)

    const deal: Deal = {
      id: Date.now().toString(),
      address: newDeal.address,
      city: newDeal.city,
      state: newDeal.state,
      zip: newDeal.zip,
      arv,
      askingPrice,
      repairCost,
      mao,
      profit: mao - askingPrice,
      status: "Active",
      notes: newDeal.notes,
      createdAt: new Date(),
    }

    setDeals([deal, ...deals])
    setNewDeal({ address: "", city: "", state: "", zip: "", arv: "", askingPrice: "", repairCost: "", notes: "" })
    setShowAddDeal(false)
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Real Estate Deal Analyzer</h1>
          <p className="text-neutral-400">
            Track wholesale deals, analyze properties, and calculate MAO for your clients.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://cookinflips.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-all"
          >
            CookinFlips
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setShowAddDeal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New Deal</h2>
              <button onClick={() => setShowAddDeal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Property Search */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Search Property Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter address to search..."
                    className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106]"
                  />
                  <button
                    onClick={handleSearchProperty}
                    disabled={isSearching}
                    className="px-4 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                    {searchResults.map((property, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectProperty(property)}
                        className="cursor-pointer hover:bg-neutral-700 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2 text-white font-medium">
                          <MapPin className="w-4 h-4 text-[#d4a106]" />
                          {property.address}, {property.city}, {property.state} {property.zip}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-400">Est. Value:</span>
                            <span className="text-[#d4a106] ml-2">${property.estimatedValue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Beds/Baths:</span>
                            <span className="text-white ml-2">
                              {property.bedrooms}/{property.bathrooms}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Sqft:</span>
                            <span className="text-white ml-2">{property.sqft.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-neutral-400 mb-2">Address</label>
                  <input
                    type="text"
                    value={newDeal.address}
                    onChange={(e) => setNewDeal({ ...newDeal, address: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">City</label>
                  <input
                    type="text"
                    value={newDeal.city}
                    onChange={(e) => setNewDeal({ ...newDeal, city: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">State</label>
                    <input
                      type="text"
                      value={newDeal.state}
                      onChange={(e) => setNewDeal({ ...newDeal, state: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">ZIP</label>
                    <input
                      type="text"
                      value={newDeal.zip}
                      onChange={(e) => setNewDeal({ ...newDeal, zip: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                    />
                  </div>
                </div>
              </div>

              {/* Deal Numbers */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">ARV (After Repair Value)</label>
                  <input
                    type="number"
                    value={newDeal.arv}
                    onChange={(e) => setNewDeal({ ...newDeal, arv: e.target.value })}
                    placeholder="$250,000"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Asking Price</label>
                  <input
                    type="number"
                    value={newDeal.askingPrice}
                    onChange={(e) => setNewDeal({ ...newDeal, askingPrice: e.target.value })}
                    placeholder="$150,000"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Repair Costs</label>
                  <input
                    type="number"
                    value={newDeal.repairCost}
                    onChange={(e) => setNewDeal({ ...newDeal, repairCost: e.target.value })}
                    placeholder="$35,000"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106]"
                  />
                </div>
              </div>

              {/* Calculated Values */}
              {newDeal.arv && newDeal.repairCost && (
                <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-neutral-400 text-sm">Maximum Allowable Offer (70% Rule)</span>
                      <div className="text-2xl font-bold text-[#d4a106]">
                        $
                        {calculateMAO(
                          Number.parseFloat(newDeal.arv),
                          Number.parseFloat(newDeal.repairCost),
                        ).toLocaleString()}
                      </div>
                    </div>
                    {newDeal.askingPrice && (
                      <div>
                        <span className="text-neutral-400 text-sm">Potential Profit</span>
                        <div className="text-2xl font-bold text-green-400">
                          $
                          {(
                            calculateMAO(Number.parseFloat(newDeal.arv), Number.parseFloat(newDeal.repairCost)) -
                            Number.parseFloat(newDeal.askingPrice)
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Notes</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  rows={3}
                  placeholder="Add notes about this deal..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#d4a106] resize-none"
                />
              </div>

              <button
                onClick={handleSaveDeal}
                className="w-full py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-neutral-400">Active Deals</span>
          </div>
          <div className="text-3xl font-bold text-white">{deals.filter((d) => d.status === "Active").length}</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-neutral-400">Under Contract</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {deals.filter((d) => d.status === "Under Contract").length}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-neutral-400">Closed Deals</span>
          </div>
          <div className="text-3xl font-bold text-white">{deals.filter((d) => d.status === "Closed").length}</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-neutral-400">Total Profit</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            $
            {deals
              .filter((d) => d.status === "Closed")
              .reduce((acc, d) => acc + d.profit, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["deals", "calculator"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              activeTab === tab ? "bg-[#d4a106] text-black" : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {tab === "deals" ? "My Deals" : "MAO Calculator"}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      {activeTab === "deals" && (
        <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left p-4 text-neutral-400 font-medium">Property</th>
                <th className="text-right p-4 text-neutral-400 font-medium">ARV</th>
                <th className="text-right p-4 text-neutral-400 font-medium">Asking</th>
                <th className="text-right p-4 text-neutral-400 font-medium">Repairs</th>
                <th className="text-right p-4 text-neutral-400 font-medium">MAO</th>
                <th className="text-right p-4 text-neutral-400 font-medium">Profit</th>
                <th className="text-center p-4 text-neutral-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <div>
                        <span className="text-white">{deal.address}</span>
                        <div className="text-sm text-neutral-500">
                          {deal.city}, {deal.state} {deal.zip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-white">${deal.arv.toLocaleString()}</td>
                  <td className="p-4 text-right text-white">${deal.askingPrice.toLocaleString()}</td>
                  <td className="p-4 text-right text-amber-400">${deal.repairCost.toLocaleString()}</td>
                  <td className="p-4 text-right text-blue-400">${deal.mao.toLocaleString()}</td>
                  <td className="p-4 text-right text-green-400 font-bold">${deal.profit.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        deal.status === "Active"
                          ? "bg-blue-500/20 text-blue-400"
                          : deal.status === "Under Contract"
                            ? "bg-amber-500/20 text-amber-400"
                            : deal.status === "Closed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calculator */}
      {activeTab === "calculator" && (
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#d4a106]" />
              <h2 className="text-xl font-bold text-white">MAO Calculator (70% Rule)</h2>
            </div>
            <p className="text-neutral-400 mb-6">
              Calculate your Maximum Allowable Offer: <br />
              <span className="text-[#d4a106] font-mono">MAO = (ARV × 70%) - Repairs</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">After Repair Value (ARV)</label>
                <input
                  type="number"
                  value={arvInput}
                  onChange={(e) => setArvInput(e.target.value)}
                  placeholder="250000"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106]"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Estimated Repairs</label>
                <input
                  type="number"
                  value={repairsInput}
                  onChange={(e) => setRepairsInput(e.target.value)}
                  placeholder="35000"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4a106]"
                />
              </div>
              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-colors"
              >
                Calculate MAO
              </button>
              {maoResult !== null && (
                <div className="p-4 rounded-xl bg-neutral-800/50 text-center">
                  <span className="text-neutral-400 text-sm">Maximum Allowable Offer</span>
                  <div className="text-3xl font-bold text-[#d4a106]">${maoResult.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CookinCapital CTA */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#d4a106]/10 to-transparent border border-[#d4a106]/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Need Financing for Your Deals?</h3>
            <p className="text-neutral-400">
              CookinCapital™ offers fix & flip, bridge, and DSCR loans with fast approvals.
            </p>
          </div>
          <a
            href="https://cookincapital.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a106] text-black font-semibold rounded-xl hover:bg-[#b8910a] transition-all whitespace-nowrap"
          >
            Apply for Financing
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function RealEstatePage() {
  return (
    <Suspense fallback={null}>
      <RealEstateContent />
    </Suspense>
  )
}
