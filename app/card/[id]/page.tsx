"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Download,
  Share2,
  Copy,
  Check,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react"

// Demo card data - in production this would come from database
const cardData = {
  name: "Partner Name",
  title: "CookinPartners Affiliate",
  company: "Saint Vision Technologies",
  email: "partner@cookinpartners.com",
  phone: "+1 (555) 123-4567",
  website: "https://cookinpartners.com",
  location: "United States",
  bio: "Helping clients build wealth through real estate investments, trading, and business intelligence powered by SaintSal™ AI.",
  photo: "/professional-headshot.png",
  affiliateCode: "PARTNER123",
  tier: "VP Partner",
  commission: "25%",
  socials: {
    linkedin: "https://linkedin.com/in/partner",
    twitter: "https://twitter.com/partner",
    instagram: "https://instagram.com/partner",
  },
  platforms: [
    { name: "CookinPartners", url: "https://cookinpartners.com", desc: "Affiliate Program" },
    { name: "CookinCapital", url: "https://cookincapital.com", desc: "Real Estate Lending" },
    { name: "CookinFlips", url: "https://cookinflips.com", desc: "Investment Platform" },
    { name: "SaintSal™", url: "https://saintsal.ai", desc: "AI Assistant" },
  ],
}

export default function DigitalCard({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleCopyLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData.name} - ${cardData.title}`,
          text: `Connect with ${cardData.name} from ${cardData.company}`,
          url: window.location.href,
        })
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
TITLE:${cardData.title}
ORG:${cardData.company}
EMAIL:${cardData.email}
TEL:${cardData.phone}
URL:${cardData.website}
NOTE:${cardData.bio}
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${cardData.name.replace(/\s+/g, "_")}.vcf`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent" />

          {/* SaintSal™ Branding */}
          <div className="relative z-10 p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/transparentsaintsallogo.png"
                  alt="SaintSal™"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-sm font-semibold text-emerald-400">SaintSal™</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-300">{cardData.tier}</span>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative z-10 px-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <Image
                  src={cardData.photo || "/placeholder.svg"}
                  alt={cardData.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white">
                {cardData.commission} Commission
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">{cardData.name}</h1>
            <p className="text-emerald-400 font-medium mb-1">{cardData.title}</p>
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-4">
              <Building2 className="h-4 w-4" />
              <span>{cardData.company}</span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-6">{cardData.bio}</p>
          </div>

          {/* Contact Buttons */}
          <div className="px-6 grid grid-cols-2 gap-3 mb-6">
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12">
              <a href={`tel:${cardData.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
            <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl h-12">
              <a href={`mailto:${cardData.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="px-6 space-y-3 mb-6">
            <a
              href={`tel:${cardData.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Phone className="h-5 w-5 text-emerald-400" />
              <span className="text-white/80">{cardData.phone}</span>
            </a>
            <a
              href={`mailto:${cardData.email}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Mail className="h-5 w-5 text-emerald-400" />
              <span className="text-white/80">{cardData.email}</span>
            </a>
            <a
              href={cardData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Globe className="h-5 w-5 text-emerald-400" />
              <span className="text-white/80">{cardData.website}</span>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <span className="text-white/80">{cardData.location}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="px-6 mb-6">
            <div className="flex justify-center gap-4">
              {cardData.socials.linkedin && (
                <a
                  href={cardData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-blue-500/20 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-white/70 hover:text-blue-400" />
                </a>
              )}
              {cardData.socials.twitter && (
                <a
                  href={cardData.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-sky-500/20 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-white/70 hover:text-sky-400" />
                </a>
              )}
              {cardData.socials.instagram && (
                <a
                  href={cardData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-pink-500/20 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-white/70 hover:text-pink-400" />
                </a>
              )}
            </div>
          </div>

          {/* Platform Links */}
          <div className="px-6 mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Our Platforms</h3>
            <div className="grid grid-cols-2 gap-2">
              {cardData.platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {platform.name}
                    </div>
                    <div className="text-xs text-white/40">{platform.desc}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Affiliate Code */}
          <div className="px-6 mb-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-xs text-emerald-300/70 mb-1">Affiliate Code</p>
              <p className="text-lg font-mono font-bold text-emerald-400">{cardData.affiliateCode}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 grid grid-cols-3 gap-2">
            <Button
              onClick={handleDownloadVCard}
              variant="outline"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl h-12 flex flex-col items-center justify-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs">Save</span>
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl h-12 flex flex-col items-center justify-center gap-1"
            >
              {shareSuccess ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span className="text-xs">{shareSuccess ? "Shared!" : "Share"}</span>
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl h-12 flex flex-col items-center justify-center gap-1"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 text-center">
            <p className="text-xs text-white/30">
              Powered by{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                SaintSal™
              </Link>{" "}
              &{" "}
              <Link
                href="https://cookinpartners.com"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                CookinPartners
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
