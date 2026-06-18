import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ plano?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, onboarding_completo')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'coach' || profile?.role === 'admin') redirect('/dashboard')
  if (profile?.onboarding_completo) redirect('/dashboard/cliente')

  const { plano } = await searchParams

  return <OnboardingForm nome={profile?.full_name ?? ''} plano={plano ?? ''} />
}
