import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata ?? {}

    // PT Session one-time payment
    if (metadata.pt_session_id) {
      await supabase
        .from('pt_sessions')
        .update({
          client_id: metadata.client_id,
          estado: 'reservado',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', metadata.pt_session_id)
    }

    // Subscription checkout
    if (metadata.user_id && metadata.plano) {
      await Promise.all([
        supabase.from('subscriptions').upsert({
          client_id: metadata.user_id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plano: metadata.plano,
          status: 'active',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'client_id' }),
        supabase.from('profiles').update({ onboarding_completo: true }).eq('id', metadata.user_id),
      ])
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase.from('subscriptions')
      .update({
        status: sub.status,
        periodo_inicio: new Date(((sub as unknown as { current_period_start: number }).current_period_start) * 1000).toISOString(),
        periodo_fim: new Date(((sub as unknown as { current_period_end: number }).current_period_end) * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
