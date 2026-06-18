import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('client_id', user.id).maybeSingle()

  const planoLabel: Record<string, string> = { standard: 'Standard (49€/mês)', premium: 'Premium (89€/mês)' }
  const statusLabel: Record<string, string> = { active: 'Activa', canceled: 'Cancelada', past_due: 'Pagamento em falta', trialing: 'Período experimental' }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight">A minha conta</h1>
      </div>

      <div className="rounded-2xl border p-6 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h2 className="font-bold mb-2">Perfil</h2>
        <Row label="Nome" value={profile?.full_name ?? '—'} />
        <Row label="Email" value={user.email ?? '—'} />
        <Row label="Objetivo" value={profile?.objetivo ?? '—'} />
        <Row label="Telefone" value={profile?.telefone ?? '—'} />
      </div>

      <div className="rounded-2xl border p-6 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h2 className="font-bold mb-2">Subscrição</h2>
        {subscription ? (
          <>
            <Row label="Plano" value={planoLabel[subscription.plano ?? ''] ?? subscription.plano ?? '—'} />
            <Row label="Estado" value={statusLabel[subscription.status ?? ''] ?? subscription.status ?? '—'} />
            {subscription.periodo_fim && (
              <Row label="Renovação" value={new Date(subscription.periodo_fim).toLocaleDateString('pt-PT')} />
            )}
          </>
        ) : (
          <>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ainda não tens nenhuma subscrição activa.</p>
            <a href="/precos" className="text-sm font-bold mt-2 py-2.5 rounded-xl text-center" style={{ background: 'var(--accent)', color: '#ffffff' }}>
              Ver planos
            </a>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
