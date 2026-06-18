import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ClienteHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name, objetivo, role').eq('id', user.id).single()
  if (profile?.role === 'coach' || profile?.role === 'admin') redirect('/dashboard')

  const [{ data: subscription }, { data: programa }, { data: ultimoCheckin }, { data: proximoEvento }] = await Promise.all([
    supabase.from('subscriptions').select('plano, status, periodo_fim').eq('client_id', user.id).maybeSingle(),
    supabase
      .from('client_programs')
      .select('id, data_inicio, programs:program_id(titulo, descricao, semanas, nivel)')
      .eq('client_id', user.id)
      .eq('activo', true)
      .maybeSingle(),
    supabase
      .from('checkins')
      .select('id, created_at, respondido')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('events')
      .select('id, titulo, data_evento, distancia, local')
      .gte('data_evento', new Date().toISOString())
      .order('data_evento', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const planoLabel: Record<string, string> = { standard: 'Standard', premium: 'Premium' }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Olá, {profile?.full_name?.split(' ')[0] ?? 'atleta'} 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {profile?.objetivo ? `Objetivo: ${profile.objetivo}` : 'Bem-vindo à tua área Evolve'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plano */}
        <div className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>O teu plano</span>
          {subscription ? (
            <>
              <span className="text-xl font-black">{planoLabel[subscription.plano ?? ''] ?? subscription.plano}</span>
              <span className="text-xs" style={{ color: subscription.status === 'active' ? 'var(--accent)' : '#ff6b6b' }}>
                {subscription.status === 'active' ? 'Activo' : subscription.status}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem subscrição activa</span>
              <Link href="/precos" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Ver planos →</Link>
            </>
          )}
        </div>

        {/* Check-in */}
        <div className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Check-in semanal</span>
          {ultimoCheckin ? (
            <>
              <span className="text-sm">Último: {new Date(ultimoCheckin.created_at).toLocaleDateString('pt-PT')}</span>
              <span className="text-xs" style={{ color: ultimoCheckin.respondido ? 'var(--accent)' : 'var(--muted-foreground)' }}>
                {ultimoCheckin.respondido ? 'Respondido pelo coach' : 'A aguardar resposta'}
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ainda não fizeste o teu primeiro check-in</span>
          )}
          <Link href="/dashboard/cliente/check-in" className="text-xs font-medium mt-1" style={{ color: 'var(--accent)' }}>
            Fazer check-in →
          </Link>
        </div>

        {/* Evento SRC */}
        <div className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Próximo evento SRC</span>
          {proximoEvento ? (
            <>
              <span className="text-sm font-bold">{proximoEvento.titulo}</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {new Date(proximoEvento.data_evento).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} · {proximoEvento.distancia}
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem eventos agendados</span>
          )}
          <Link href="/dashboard/cliente/comunidade" className="text-xs font-medium mt-1" style={{ color: 'var(--accent)' }}>
            Ver comunidade →
          </Link>
        </div>
      </div>

      {/* Programa atribuído */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h2 className="font-bold mb-4">🏋️ O teu programa</h2>
        {programa?.programs ? (
          <div className="flex flex-col gap-2">
            <span className="text-lg font-black">{(programa.programs as any).titulo}</span>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{(programa.programs as any).descricao}</p>
            <div className="flex gap-4 text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
              <span>{(programa.programs as any).semanas} semanas</span>
              <span>Nível: {(programa.programs as any).nivel}</span>
            </div>
            <Link href="/dashboard/cliente/treino" className="text-xs font-medium mt-2" style={{ color: 'var(--accent)' }}>
              Ver plano de treino →
            </Link>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Ainda não tens nenhum programa atribuído. O teu coach vai atribuir-te um em breve.
          </p>
        )}
      </div>
    </div>
  )
}
