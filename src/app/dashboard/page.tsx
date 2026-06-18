import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoachCharts from '@/components/CoachCharts'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  // Stats principais
  const [
    { count: clientesCount },
    { count: srcCount },
    { data: checkinsRecentes },
    { data: subscriptions },
    { data: ptSessoes },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('event_registrations').select('client_id', { count: 'exact', head: true }),
    supabase
      .from('checkins')
      .select('id, rating, created_at, profiles:client_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('subscriptions').select('plano, status').eq('status', 'active'),
    supabase.from('pt_sessions').select('id, estado').eq('estado', 'reservado'),
  ])

  // Check-ins das últimas 8 semanas agrupados
  const weekData = await Promise.all(
    Array.from({ length: 8 }).map(async (_, i) => {
      const fim = new Date()
      fim.setDate(fim.getDate() - i * 7)
      const inicio = new Date(fim)
      inicio.setDate(inicio.getDate() - 7)

      const { data } = await supabase
        .from('checkins')
        .select('rating')
        .gte('created_at', inicio.toISOString())
        .lt('created_at', fim.toISOString())

      const checkins = data?.length ?? 0
      const mediaRating = checkins > 0
        ? Math.round((data!.reduce((s, c) => s + (c.rating ?? 0), 0) / checkins) * 10) / 10
        : 0

      const label = inicio.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
      return { semana: label, checkins, mediaRating }
    })
  )
  weekData.reverse()

  // Distribuição de planos
  const planData = ['starter', 'standard', 'premium'].map((plano) => ({
    name: plano,
    value: subscriptions?.filter((s) => s.plano === plano).length ?? 0,
  }))

  const semanaInicio = new Date()
  semanaInicio.setDate(semanaInicio.getDate() - 7)
  const checkinsSemana = weekData[weekData.length - 1]?.checkins ?? 0

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 19 ? 'Boa tarde' : 'Boa noite'

  const stats = [
    { label: 'Clientes activos', value: String(clientesCount ?? 0), sub: 'na plataforma', color: '#2d71e0' },
    { label: 'Check-ins esta semana', value: String(checkinsSemana), sub: 'últimos 7 dias', color: '#22c55e' },
    { label: 'PT a aguardar', value: String(ptSessoes?.length ?? 0), sub: 'sessões reservadas', color: '#f59e0b' },
    { label: 'Membros SRC', value: String(srcCount ?? 0), sub: 'inscrições em eventos', color: '#8b5cf6' },
  ]

  const eventos = await supabase
    .from('events')
    .select('id, titulo, data_evento, distancia')
    .gte('data_evento', new Date().toISOString())
    .order('data_evento', { ascending: true })
    .limit(3)

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-6xl w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          {saudacao}, {profile?.full_name?.split(' ')[0] ?? 'Coach'} 👋
        </h1>
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
            <span className="text-3xl font-black tracking-tight" style={{ color: stat.color }}>{stat.value}</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <CoachCharts weekData={weekData} planData={planData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Check-ins recentes */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-sm">Check-ins recentes</h2>
            <Link href="/dashboard/check-ins" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {checkinsRecentes && checkinsRecentes.length > 0 ? (
              checkinsRecentes.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
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
                      <span key={i} className="text-sm" style={{ color: i < (c.rating ?? 0) ? '#f59e0b' : 'var(--card-border)' }}>★</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ainda sem check-ins.</p>
            )}
          </div>
        </div>

        {/* Próximos eventos SRC */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-sm">Próximos eventos SRC</h2>
            <Link href="/dashboard/comunidade" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              Gerir
            </Link>
          </div>
          {eventos.data && eventos.data.length > 0 ? (
            <div className="flex flex-col gap-3">
              {eventos.data.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-xl border p-4 flex items-center gap-4"
                  style={{ borderColor: 'var(--card-border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 text-center leading-tight"
                    style={{ background: 'rgba(45,113,224,0.12)', color: 'var(--accent)' }}
                  >
                    {new Date(ev.data_evento).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }).replace(' ', '\n')}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm">{ev.titulo}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ev.distancia}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Sem eventos agendados. Cria o primeiro evento SRC na Comunidade.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
