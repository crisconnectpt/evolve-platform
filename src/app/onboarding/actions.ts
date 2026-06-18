'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { stripe, PLANS } from '@/lib/stripe'

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

  const plano = formData.get('plano') as string
  const plan = PLANS[plano as keyof typeof PLANS]

  if (plan) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cliente`,
      metadata: { user_id: user.id, plano },
    })
    if (session.url) redirect(session.url)
  }

  redirect('/dashboard/cliente')
}
