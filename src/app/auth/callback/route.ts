import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const plan = searchParams.get('plan')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Create profile if doesn't exist
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
          avatar_url: data.user.user_metadata.avatar_url,
          tier: plan || 'free',
        })
      }

      // Redirect to checkout if paid plan selected
      if (plan && plan !== 'free') {
        return NextResponse.redirect(`${origin}/checkout?plan=${plan}`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
