import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProgressCharts from '@/components/ProgressCharts'

export default async function ProgressoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: checkins } = await supabase
    .from('checkins')
    .select('created_at, rating, energia, sono, treinos_feitos')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(12)

  const data = (checkins ?? []).map((c) => ({
    semana: new Date(c.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    rating: c.rating ?? 0,
    energia: c.energia ?? 0,
    sono: c.sono ?? 0,
    treinos: c.treinos_feitos ?? 0,
  }))

  // Médias das últimas 4 semanas
  const ultimas4 = data.slice(0, 4)
  const media = (key: keyof typeof ultimas4[0]) =>
    ultimas4.length ? (ultimas4.reduce((s, c) => s + (c[key] as number), 0) / ultimas4.length).toFixed(1) : '—'

  return (
    <div className="p-6 md:p-10 max-w-4xl w-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">O meu progresso</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Evolução baseada nos teus check-ins semanais
        </p>
      </div>

      {/* Resumo médias */}
      {ultimas4.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Bem-estar', valor: media('rating'), max: '/5', color: '#2d71e0' },
            { label: 'Energia', valor: media('energia'), max: '/5', color: '#22c55e' },
            { label: 'Sono', valor: media('sono'), max: 'h', color: '#8b5cf6' },
            { label: 'Treinos/sem', valor: media('treinos'), max: '', color: '#f59e0b' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border p-5 flex flex-col gap-1"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                {s.label}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-black tabular-nums" style={{ color: s.color }}>
                  {s.valor}
                </span>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.max}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>média 4 semanas</span>
            </div>
          ))}
        </div>
      )}

      <ProgressCharts data={data} />
    </div>
  )
}
