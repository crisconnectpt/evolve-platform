import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NovoEvento from './NovoEvento'

export default async function ComunidadePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: eventos } = await supabase
    .from('events')
    .select('id, titulo, data_evento, local, distancia, max_participantes')
    .gte('data_evento', new Date().toISOString())
    .order('data_evento', { ascending: true })
    .limit(6)

  const eventIds = (eventos ?? []).map((e) => e.id)
  const counts: Record<string, number> = {}
  if (eventIds.length > 0) {
    const { data: regs } = await supabase.from('event_registrations').select('event_id').in('event_id', eventIds)
    for (const r of regs ?? []) counts[r.event_id] = (counts[r.event_id] ?? 0) + 1
  }

  const { count: membrosCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client')
  const { count: eventosRealizados } = await supabase.from('events').select('*', { count: 'exact', head: true }).lt('data_evento', new Date().toISOString())

  // Leaderboard: contagem de inscrições por cliente (proxy de participação)
  const { data: todasInscricoes } = await supabase
    .from('event_registrations')
    .select('client_id, profiles:client_id(full_name)')

  const counter = new Map<string, { nome: string; total: number }>()
  for (const r of todasInscricoes ?? []) {
    const key = r.client_id
    const nome = (r.profiles as any)?.full_name ?? 'Cliente'
    const entry = counter.get(key) ?? { nome, total: 0 }
    entry.total += 1
    counter.set(key, entry)
  }
  const leaderboard = Array.from(counter.values()).sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Comunidade SRC</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Saturday Running Club — Funchal
          </p>
        </div>
        <NovoEvento />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h2 className="font-bold mb-5">🏆 Leaderboard — eventos SRC</h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem inscrições ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {leaderboard.map((m, i) => (
                <div key={m.nome + i} className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-black" style={{ color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted-foreground)' }}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: i === 0 ? 'var(--accent)' : 'var(--muted)', color: i === 0 ? '#ffffff' : 'var(--foreground)' }}>
                    {m.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm font-medium">{m.nome}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{m.total} eventos</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats da comunidade */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'Membros activos SRC', value: String(membrosCount ?? 0), icon: '🏃' },
            { label: 'Eventos futuros', value: String(eventos?.length ?? 0), icon: '📅' },
            { label: 'Eventos realizados', value: String(eventosRealizados ?? 0), icon: '🗓️' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-4 flex items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos eventos */}
      <div>
        <h2 className="font-bold mb-5">📅 Próximos eventos</h2>
        {eventos && eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventos.map((ev) => (
              <div key={ev.id} className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    {new Date(ev.data_evento).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} · {new Date(ev.data_evento).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{counts[ev.id] ?? 0}{ev.max_participantes ? `/${ev.max_participantes}` : ''}</span>
                </div>
                <div>
                  <div className="font-bold">{ev.titulo}</div>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{ev.distancia}</div>
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>📍 {ev.local}</div>
                {ev.max_participantes && (
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--muted)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, ((counts[ev.id] ?? 0) / ev.max_participantes) * 100)}%`, background: 'var(--accent)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
            Sem eventos agendados. Cria o primeiro evento SRC.
          </div>
        )}
      </div>
    </div>
  )
}
