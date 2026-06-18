import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorkoutCard from './WorkoutCard'

export default async function MeuTreinoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cp } = await supabase
    .from('client_programs')
    .select('program_id, data_inicio, programs:program_id(id, titulo, descricao, semanas, nivel, tag)')
    .eq('client_id', user.id)
    .eq('activo', true)
    .maybeSingle()

  let workouts: any[] = []
  if (cp?.program_id) {
    const { data } = await supabase
      .from('workouts')
      .select('id, semana, dia, tipo, titulo, descricao')
      .eq('program_id', cp.program_id)
      .order('semana', { ascending: true })
    workouts = data ?? []
  }

  const { data: logs } = await supabase
    .from('workout_logs')
    .select('workout_id, concluido')
    .eq('client_id', user.id)

  const logMap = new Map((logs ?? []).map((l) => [l.workout_id, l.concluido]))

  const workoutsComEstado = workouts.map((w) => ({
    ...w,
    concluido: logMap.get(w.id) ?? false,
  }))

  const totalFeitos = workoutsComEstado.filter((w) => w.concluido).length
  const total = workoutsComEstado.length
  const progresso = total > 0 ? Math.round((totalFeitos / total) * 100) : 0

  // Agrupar por semana
  const porSemana = new Map<number, typeof workoutsComEstado>()
  for (const w of workoutsComEstado) {
    if (!porSemana.has(w.semana)) porSemana.set(w.semana, [])
    porSemana.get(w.semana)!.push(w)
  }

  const programa = cp?.programs as any

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">O meu treino</h1>
        {programa ? (
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {programa.titulo} · {programa.semanas} semanas · Nível {programa.nivel}
          </p>
        ) : (
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Ainda não tens um programa atribuído. O teu coach vai tratar disso em breve.
          </p>
        )}
      </div>

      {/* Progresso geral */}
      {total > 0 && (
        <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Progresso total</span>
            <span className="font-black text-lg" style={{ color: 'var(--accent)' }}>{progresso}%</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: 'var(--muted)' }}>
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ width: `${progresso}%`, background: 'var(--accent)' }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {totalFeitos} de {total} treinos concluídos
          </p>
        </div>
      )}

      {/* Treinos por semana */}
      {workoutsComEstado.length === 0 ? (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Sem treinos definidos ainda. Fala com o teu coach.
        </div>
      ) : (
        Array.from(porSemana.entries()).map(([semana, ws]) => {
          const feitos = ws.filter((w) => w.concluido).length
          return (
            <div key={semana} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Semana {semana}
                </h2>
                <span className="text-xs" style={{ color: feitos === ws.length ? 'var(--accent)' : 'var(--muted-foreground)' }}>
                  {feitos}/{ws.length} {feitos === ws.length ? '🎉' : ''}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {ws.map((w) => (
                  <WorkoutCard key={w.id} workout={w} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
