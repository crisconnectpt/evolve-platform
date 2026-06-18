import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { sessionId } = await req.json()
  if (!sessionId) return NextResponse.json({ error: 'sessionId em falta' }, { status: 400 })

  const { data: pt } = await supabase
    .from('pt_sessions')
    .select('id, titulo, preco, data_hora, estado')
    .eq('id', sessionId)
    .eq('estado', 'disponivel')
    .single()

  if (!pt) return NextResponse.json({ error: 'Sessão não disponível' }, { status: 404 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(pt.preco) * 100),
          product_data: {
            name: pt.titulo,
            description: `Sessão PT Online — ${new Date(pt.data_hora).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      pt_session_id: pt.id,
      client_id: user.id,
      client_name: profile?.full_name ?? user.email ?? '',
    },
    success_url: `${appUrl}/dashboard/cliente/pt?sucesso=1`,
    cancel_url: `${appUrl}/dashboard/cliente/pt`,
  })

  return NextResponse.json({ url: checkout.url })
}
