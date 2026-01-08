"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const affiliateCode = searchParams.get("ref")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            affiliate_code: affiliateCode || null,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#d4a106] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <img src="/images/transparentsaintsallogo.png" alt="SaintSal™" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-neutral-400 mt-2">
              Join the SaintSal<span className="text-white">™</span> community
            </p>
            {affiliateCode && (
              <div className="mt-3 inline-flex items-center gap-2 bg-[#d4a106]/10 border border-[#d4a106]/30 rounded-full px-4 py-1.5">
                <span className="text-[#d4a106] text-sm">Referred by: {affiliateCode}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#d4a106] focus:ring-[#d4a106]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white pr-10 focus:border-[#d4a106] focus:ring-[#d4a106]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-neutral-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-[#d4a106] focus:ring-[#d4a106]/20"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d4a106] hover:bg-[#b8910a] text-black font-semibold h-12"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#d4a106] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
