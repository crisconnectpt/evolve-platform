import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') {
    redirect('/dashboard/cliente')
  }

  const [{ count: clientesCount }, { count: srcCount }, { data: checkinsRecentes }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('event_registrations').select('client_id', { count: 'exact', head: true }),
    supabase
      .from('checkins')
      .select('id, rating, created_at, profiles:client_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const semanaInicio = new Date()
  semanaInicio.setDate(semanaInicio.getDate() - 7)
  const { count: checkinsSemana } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', semanaInicio.toISOString())

  const stats = [
    { label: 'Clientes activos', value: String(clientesCount ?? 0), change: 'total na plataforma' },
    { label: 'Check-ins esta semana', value: String(checkinsSemana ?? 0), change: 'últimos 7 dias' },
    { label: 'Treinos entregues', value: '—', change: 'em breve' },
    { label: 'Membros SRC', value: String(srcCount ?? 0), change: 'inscrições em eventos' },
  ]

  const eventos = await supabase
    .from('events')
    .select('id, titulo, data_evento, distancia')
    .gte('data_evento', new Date().toISOString())
    .order('data_evento', { ascending: true })
    .limit(3)

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Bom dia, {profile?.full_name?.split(' ')[0] ?? 'Coach'} 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-5 flex flex-col gap-1"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
            <span className="text-3xl font-black tracking-tight">{stat.value}</span>
            <span className="text-xs" style={{ color: 'var(--accent)' }}>{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Clientes recentes */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">👥 Clientes</h2>
            <a href="/dashboard/clientes" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Ver todos
            </a>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Tens {clientesCount ?? 0} cliente(s) registado(s) na plataforma. Consulta a lista completa para ver detalhes e estado de cada um.
          </p>
        </div>

        {/* Check-ins recentes */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">📥 Check-ins recentes</h2>
            <a href="/dashboard/check-ins" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Ver todos
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {checkinsRecentes && checkinsRecentes.length > 0 ? (
              checkinsRecentes.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--accent)', color: '#ffffff' }}
                    >
                      {(c.profiles?.full_name ?? '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{c.profiles?.full_name ?? 'Cliente'}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(c.created_at).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">{i < (c.rating ?? 0) ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ainda sem check-ins.</p>
            )}
          </div>
        </div>
      </div>

      {/* Próximos eventos SRC */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold">🏃 Saturday Running Club — próximos eventos</h2>
          <a href="/dashboard/comunidade" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
            Gerir
          </a>
        </div>
        {eventos.data && eventos.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventos.data.map((ev) => (
              <div
                key={ev.id}
                className="rounded-xl border p-4 flex flex-col gap-2"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  {new Date(ev.data_evento).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
                <span className="font-bold text-sm">{ev.titulo}</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ev.distancia}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem eventos agendados. Cria o primeiro evento SRC na Comunidade.</p>
        )}
      </div>
    </div>
  )
}
