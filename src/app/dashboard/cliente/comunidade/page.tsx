import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventCard from './EventCard'

export default async function ComunidadeClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eventos } = await supabase
    .from('events')
    .select('id, titulo, descricao, data_evento, local, distancia, max_participantes')
    .gte('data_evento', new Date().toISOString())
    .order('data_evento', { ascending: true })

  const { data: minhasInscricoes } = await supabase
    .from('event_registrations')
    .select('event_id')
    .eq('client_id', user.id)

  const inscritosSet = new Set((minhasInscricoes ?? []).map((i) => i.event_id))

  // contagem de inscritos por evento
  const counts: Record<string, number> = {}
  if (eventos && eventos.length > 0) {
    const { data: regs } = await supabase
      .from('event_registrations')
      .select('event_id')
      .in('event_id', eventos.map((e) => e.id))
    for (const r of regs ?? []) {
      counts[r.event_id] = (counts[r.event_id] ?? 0) + 1
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Comunidade SRC</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Saturday Running Club — Funchal. Inscreve-te nos próximos eventos.
        </p>
      </div>

      {eventos && eventos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eventos.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              inscrito={inscritosSet.has(ev.id)}
              inscritos={counts[ev.id] ?? 0}
              max={ev.max_participantes}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Sem eventos agendados de momento.
        </div>
      )}
    </div>
  )
}
