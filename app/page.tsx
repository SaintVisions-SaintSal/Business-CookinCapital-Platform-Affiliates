import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Building2,
  MessageSquare,
  Code,
  Mic,
  Brain,
  ChevronRight,
  Users,
  Home,
  ExternalLink,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,256,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,256,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Navigation - Apple style minimal */}
      <nav className="relative z-50 border-b border-white/5 bg-black/90 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/transparentsaintsallogo.png"
                  alt="SaintSal™"
                  width={56}
                  height={56}
                  className="rounded-xl drop-shadow-[0_0_15px_rgba(245,200,66,0.4)]"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-3xl font-serif font-bold tracking-tight text-gold-shimmer"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  SaintSal<sup className="text-xs">™</sup>
                </span>
                <span className="text-[11px] text-white/50 tracking-[0.2em] uppercase font-light">
                  By Saint Vision Technologies
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#ecosystem"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide"
              >
                Ecosystem
              </Link>
              <Link
                href="#ai"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide"
              >
                AI
              </Link>
              <Link
                href="#ip"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide"
              >
                IP Portfolio
              </Link>
              <a
                href="https://cookinpartners.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold-shimmer font-semibold hover:drop-shadow-[0_0_8px_rgba(245,200,66,0.6)] transition-all tracking-wide"
              >
                Become a Partner
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-[#c9a84a] via-[#f5c842] to-[#c9a84a] bg-[length:200%_100%] text-black text-sm font-bold rounded-full hover:bg-[position:100%_0] transition-all duration-300 tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(245,200,66,0.5)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="text-xs font-bold text-emerald-400 tracking-wider">4 IP ARSENAL</span>
            <span className="text-sm text-white/60">2 Patents + 2 Trademarks • Fully Issued</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 leading-[1.1]">
            <span className="text-white font-extralight">Responsible</span>
            <br />
            <span className="text-gold-hero-shimmer font-medium">Intelligence.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
            The world's first faith-based AI. First Human AI Protocol.
            <br className="hidden md:block" />
            First Human AI Agents. Powered by SaintSal<sup className="text-white text-xs">™</sup> & HACP
            <sup className="text-white text-xs">™</sup>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide">FIRST FAITH-BASED AI</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span className="text-xs font-medium text-teal-300 tracking-wide">FIRST HUMAN AI PROTOCOL</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-medium text-cyan-300 tracking-wide">FIRST HUMAN AI AGENTS</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs">🍎</span>
              <span className="text-xs font-medium text-amber-300 tracking-wide">ON APPLE & GOOGLE</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all text-lg"
            >
              Start building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://cookinpartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 text-emerald-400 hover:text-emerald-300 transition-all text-lg border border-emerald-400/30 rounded-full hover:border-emerald-400/50"
            >
              <Users className="w-5 h-5" />
              Partner Program
            </a>
          </div>

          {/* Hero visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1">
              <div className="rounded-[20px] overflow-hidden bg-[#0a0a0a]">
                <Image
                  src="/images/svt-office.png"
                  alt="Saint Vision Technologies"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section - Links to other properties */}
      <section id="ecosystem" className="py-32 px-6 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-bold tracking-[0.2em] mb-4 uppercase">The SaintSal™ Ecosystem</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              One vision.
              <br />
              <span className="text-gold-gradient">Multiple platforms.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              SaintSal™ powers an entire ecosystem of wealth-building platforms. Each one built with the same AI
              foundation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CookinPartners */}
            <a
              href="https://cookinpartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4">
                <ExternalLink className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">CookinPartners</h3>
              <p className="text-white/60 mb-4">
                Our affiliate and partnership program. Earn up to 30% commissions + VP override bonuses.
              </p>
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <span>Join the partner program</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* CookinCapital */}
            <a
              href="https://cookincapital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4">
                <ExternalLink className="w-5 h-5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">CookinCapital</h3>
              <p className="text-white/60 mb-4">
                Commercial & residential lending. Real estate investments. Institutional capital solutions.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <span>Explore lending solutions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* CookinFlips */}
            <a
              href="https://cookinflips.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4">
                <ExternalLink className="w-5 h-5 text-green-400/50 group-hover:text-green-400 transition-colors" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center mb-6">
                <Home className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">CookinFlips</h3>
              <p className="text-white/60 mb-4">
                Real estate investment platform. Wholesale deals, fix & flips, and passive investment opportunities.
              </p>
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <span>Find investment deals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "$2B+", label: "Funds Delivered" },
              { value: "$3B+", label: "Assets Resolved" },
              { value: "50+", label: "Lending Partners" },
              { value: "12,000+", label: "Active Users" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaintSal AI Section */}
      <section id="ai" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-amber-400 text-sm font-medium mb-4">SAINTSAL™ AI</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
              Meet your AI
              <br />
              <span className="text-gold-gradient">business partner.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              SaintSal™ understands your goals, analyzes markets, and delivers actionable insights 24/7.
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: MessageSquare,
                title: "Natural Conversations",
                description:
                  "Talk to SaintSal™ like a trusted advisor. Ask anything about business, investing, or strategy.",
              },
              {
                icon: Brain,
                title: "Deep Analysis",
                description: "Get comprehensive market analysis, property valuations, and investment recommendations.",
              },
              {
                icon: Mic,
                title: "Voice Enabled",
                description: "Speak naturally. SaintSal™ listens, understands, and responds with voice or text.",
              },
              {
                icon: Code,
                title: "Code Generation",
                description:
                  "Need automations? SaintSal™ writes code, builds integrations, and automates your workflow.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-4 group-hover:from-amber-400/30 group-hover:to-amber-600/30 transition-colors">
                  <feature.icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Chat Preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <Image src="/images/thatdripbottomsaintsallogo.png" alt="SaintSal™" width={32} height={32} />
                </div>
                <span className="text-sm font-medium">SaintSal™ Chat</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 ml-auto">Online</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">You</div>
                  <div className="flex-1 p-4 rounded-2xl bg-white/5 text-sm">
                    Analyze this property for wholesale potential: 123 Main St, Atlanta GA. ARV around $280k.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <Image src="/images/thatdripbottomsaintsallogo.png" alt="SaintSal™" width={32} height={32} />
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm">
                    <p className="text-amber-400 font-medium mb-2">Property Analysis Complete</p>
                    <p className="text-white/70 mb-3">Based on comps and market data for Atlanta:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-white/50">ARV:</span> <span className="text-white">$280,000</span>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-white/50">MAO (70%):</span>{" "}
                        <span className="text-green-400">$196,000</span>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-white/50">Repair Est:</span> <span className="text-white">$25,000</span>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-white/50">Max Offer:</span>{" "}
                        <span className="text-amber-400">$171,000</span>
                      </div>
                    </div>
                    <p className="text-white/50 mt-3 text-xs">
                      Recommendation: Strong wholesale opportunity if acquired under $165k.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IP Portfolio Section */}
      <section
        id="ip"
        className="py-32 px-6 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-amber-400 text-sm font-bold tracking-[0.2em] mb-6 uppercase">Intellectual Property</p>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8">
              Quadruple IP Protection
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-gradient">
                $200-400M Portfolio
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              <span className="text-white font-semibold">2 Patents + 2 Trademarks</span> = Impenetrable market position
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                title: "US Patent 10,290,222",
                status: "GRANTED",
                date: "Sept 21, 2015",
                note: "3 yrs before GPT-1",
                value: "$50-100M",
                label: "Base Patent",
                gradient: "from-blue-500/20 to-blue-600/5",
                border: "border-blue-500/30",
                statusColor: "bg-blue-500/20 text-blue-300",
              },
              {
                title: "Patent 19/296,986",
                status: "HACP™ PENDING",
                date: "Aug 10, 2025",
                note: "USPTO Review",
                value: "+$75-125M",
                label: "HACP™ Patent",
                gradient: "from-amber-500/20 to-amber-600/5",
                border: "border-amber-500/30",
                statusColor: "bg-amber-500/20 text-amber-300",
              },
              {
                title: "HACP™ Mark",
                status: "LIVE",
                date: "#99329797",
                note: "Aug 10, 2025",
                value: "+$35-75M",
                label: "HACP™ Trademark",
                gradient: "from-green-500/20 to-green-600/5",
                border: "border-green-500/30",
                statusColor: "bg-green-500/20 text-green-300",
              },
              {
                title: "SaintSal™ Mark",
                status: "FILED",
                date: "#99538313",
                note: "Dec 9, 2025",
                value: "+$40-100M",
                label: "SaintSal™ Mark",
                gradient: "from-purple-500/20 to-purple-600/5",
                border: "border-purple-500/30",
                statusColor: "bg-purple-500/20 text-purple-300",
              },
            ].map((ip, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-3xl bg-gradient-to-b ${ip.gradient} border ${ip.border} hover:border-opacity-60 transition-all duration-300 group hover:scale-105`}
              >
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1.5 rounded-full ${ip.statusColor} text-xs font-bold tracking-wide`}>
                    {ip.status}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">{ip.label}</div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{ip.title}</h3>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-sm text-white/70 font-medium">{ip.date}</div>
                  <div className="text-xs text-white/50 italic">{ip.note}</div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                    {ip.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SaintSal™ Vision and HACP™ Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left - HACP */}
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300 tracking-wider">WORLD'S FIRST</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 mb-4">
                    HACP™
                  </h3>
                  <p className="text-xl text-white/80 font-medium mb-3">Human AI Connection Protocol™</p>
                  <p className="text-white/60 leading-relaxed">
                    The first protocol that bridges human intuition with artificial intelligence. Patent-pending
                    technology that creates genuine AI-human collaboration, not replacement.
                  </p>
                </div>

                {/* Right - Faith-Based AI */}
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                    <span className="text-lg">✝</span>
                    <span className="text-xs font-bold text-emerald-300 tracking-wider">FAITH-BASED AI</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 mb-4">
                    SaintSal™
                  </h3>
                  <p className="text-xl text-white/80 font-medium mb-3">First Faith-Based AI Platform™</p>
                  <p className="text-white/60 leading-relaxed">
                    Built on principles of integrity, service, and stewardship. SaintSal™ is the first AI designed to
                    align with faith-based values while delivering institutional-grade intelligence.
                  </p>
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="mt-10 pt-8 border-t border-white/10 text-center">
                <p className="text-lg text-white/70">
                  <span className="text-emerald-400 font-semibold">Responsible AI.</span>{" "}
                  <span className="text-teal-400 font-semibold">Faith-Driven.</span>{" "}
                  <span className="text-white font-semibold">Human-Centered.</span>
                </p>
                <p className="text-sm text-white/40 mt-2">
                  US Patent 10,290,222 | HACP<span className="text-white">™</span> Patent Pending | SaintSal
                  <span className="text-white">™</span> & HACP<span className="text-white">™</span> are registered
                  trademarks
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/transparentsaintsallogo.png"
                  alt="SaintSal™"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <div>
                  <span className="text-2xl font-serif font-bold text-gold-shimmer">
                    SaintSal<sup className="text-white text-sm ml-0.5">™</sup>
                  </span>
                  <p className="text-xs text-white/40">By Saint Vision Technologies</p>
                </div>
              </div>
              <p className="text-white/50 max-w-md mb-6">
                The AI-powered platform for building wealth through trading, real estate, and business intelligence.
              </p>
              <div className="text-xs text-white/30">
                US Patent 10,290,222 | HACP<span className="text-white">™</span> Patent Pending | SaintSal
                <span className="text-white">™</span> & HACP<span className="text-white">™</span> are registered
                trademarks
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Ecosystem</h4>
              <div className="space-y-3">
                <a
                  href="https://cookinpartners.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/50 hover:text-amber-400 transition-colors"
                >
                  CookinPartners
                </a>
                <a
                  href="https://cookincapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/50 hover:text-amber-400 transition-colors"
                >
                  CookinCapital
                </a>
                <a
                  href="https://cookinflips.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/50 hover:text-amber-400 transition-colors"
                >
                  CookinFlips
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-3">
                <Link href="/auth/login" className="block text-white/50 hover:text-amber-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block text-white/50 hover:text-amber-400 transition-colors">
                  Get Started
                </Link>
                <Link href="/dashboard" className="block text-white/50 hover:text-amber-400 transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Saint Vision Technologies LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
