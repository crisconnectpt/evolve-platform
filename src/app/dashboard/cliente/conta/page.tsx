import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { atualizarPerfil } from './actions'
import SubmitButton from './SubmitButton'

export default async function ContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('client_id', user.id).maybeSingle()

  const planoLabel: Record<string, string> = {
    starter: 'Starter',
    standard: 'Standard',
    premium: 'Premium',
  }
  const planoPreco: Record<string, string> = {
    starter: '29€/mês',
    standard: '49€/mês',
    premium: '89€/mês',
  }
  const planoColor: Record<string, string> = {
    starter: '#6b7280',
    standard: '#2d71e0',
    premium: '#7c3aed',
  }
  const statusLabel: Record<string, string> = {
    active: 'Activa',
    canceled: 'Cancelada',
    past_due: 'Pagamento em falta',
    trialing: 'Período experimental',
  }

  const initials = (profile?.full_name ?? user.email ?? 'U')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const plano = subscription?.plano ?? ''
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="p-6 md:p-10 max-w-2xl w-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">A minha conta</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Gere o teu perfil e subscrição
        </p>
      </div>

      {/* Avatar + nome */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          {initials}
        </div>
        <div>
          <div className="font-black text-lg">{profile?.full_name ?? '—'}</div>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{user.email}</div>
        </div>
      </div>

      {/* Editar perfil */}
      <div
        className="rounded-2xl border p-6 flex flex-col gap-5"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <h2 className="font-black text-base">Perfil</h2>
        <form action={atualizarPerfil} className="flex flex-col gap-4">
          <Field label="Nome completo" name="full_name" defaultValue={profile?.full_name ?? ''} placeholder="O teu nome" />
          <Field label="Objetivo" name="objetivo" defaultValue={profile?.objetivo ?? ''} placeholder="Ex: perder peso, ganhar músculo…" />
          <Field label="Telefone" name="telefone" defaultValue={profile?.telefone ?? ''} placeholder="+351 9xx xxx xxx" type="tel" />
          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>
      </div>

      {/* Subscrição */}
      <div
        className="rounded-2xl border p-6 flex flex-col gap-5"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <h2 className="font-black text-base">Subscrição</h2>

        {subscription ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-base font-black"
                    style={{ color: planoColor[plano] ?? 'var(--foreground)' }}
                  >
                    {planoLabel[plano] ?? plano}
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: isActive ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {statusLabel[subscription.status ?? ''] ?? subscription.status}
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  {planoPreco[plano] ?? ''}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {subscription.periodo_fim && (
                <Row
                  label="Próxima renovação"
                  value={new Date(subscription.periodo_fim).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                />
              )}
            </div>

            {plano !== 'premium' && (
              <a
                href="/#planos"
                className="text-center text-sm font-bold py-3 rounded-xl transition-opacity hover:opacity-90"
                style={{ background: 'rgba(45,113,224,0.1)', color: 'var(--accent)' }}
              >
                Fazer upgrade de plano →
              </a>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: 'rgba(45,113,224,0.06)', borderColor: 'rgba(45,113,224,0.2)', border: '1px solid' }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>
                Ainda não tens nenhuma subscrição activa. Escolhe um plano para teres acesso a treinos personalizados e acompanhamento.
              </span>
            </div>
            <a
              href="/#planos"
              className="text-center text-sm font-black py-3.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Ver planos
            </a>
          </div>
        )}
      </div>

      {/* Email (só leitura) */}
      <div
        className="rounded-2xl border p-6 flex flex-col gap-4"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <h2 className="font-black text-base">Acesso</h2>
        <Row label="Email" value={user.email ?? '—'} />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Para alterar o email ou a password contacta o suporte.
        </p>
      </div>
    </div>
  )
}

function Field({
  label, name, defaultValue, placeholder, type = 'text',
}: {
  label: string; name: string; defaultValue: string; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--card-border)',
          color: 'var(--foreground)',
        }}
      />
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
