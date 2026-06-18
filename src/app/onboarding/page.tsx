import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, onboarding_completo')
    .eq('id', user.id)
    .single()

  // Coach não faz onboarding
  if (profile?.role === 'coach' || profile?.role === 'admin') redirect('/dashboard')

  // Se já fez onboarding, vai direto
  if (profile?.onboarding_completo) redirect('/dashboard/cliente')

  return <OnboardingForm nome={profile?.full_name ?? ''} />
}
