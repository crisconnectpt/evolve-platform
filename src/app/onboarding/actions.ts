'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completarOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('profiles').update({
    full_name: formData.get('full_name') as string,
    objetivo: formData.get('objetivo') as string,
    nivel: formData.get('nivel') as string,
    dias_semana: parseInt(formData.get('dias_semana') as string) || 3,
    telefone: formData.get('telefone') as string,
    onboarding_completo: true,
  }).eq('id', user.id)

  redirect('/dashboard/cliente')
}
