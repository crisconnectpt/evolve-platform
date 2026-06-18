import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import NovoWorkout from './NovoWorkout'
import AtribuirCliente from './AtribuirCliente'

export default async function ProgramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: programa } = await supabase.from('programs').select('*').eq('id', id).single()
  if (!programa) notFound()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, semana, dia, tipo, titulo, descricao')
    .eq('program_id', id)
    .order('semana', { ascending: true })

  const { data: clientes } = await supabase.from('profiles').select('id, full_name').eq('role', 'client')

  const { data: atribuidos } = await supabase
    .from('client_programs')
    .select('client_id, profiles:client_id(full_name)')
    .eq('program_id', id)
    .eq('activo', true)

  const porSemana = new Map<number, typeof workouts>()
  for (const w of workouts ?? []) {
    if (!porSemana.has(w.semana)) porSemana.set(w.semana, [])
    porSemana.get(w.semana)!.push(w)
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <Link href="/dashboard/treinos" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>← Voltar</Link>
        <h1 className="text-2xl font-black tracking-tight mt-2">{programa.titulo}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {programa.descricao} · {programa.semanas} semanas · Nível {programa.nivel}
        </p>
      </div>

      {/* Atribuir a cliente */}
      <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h2 className="font-bold">Atribuir a cliente</h2>
        <AtribuirCliente programId={id} clientes={clientes ?? []} />
        {atribuidos && atribuidos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {atribuidos.map((a) => (
              <span key={a.client_id} className="text-xs px-3 py-1 rounded-full" style={{ background: '#2d71e022', color: 'var(--accent)' }}>
                {(a.profiles as any)?.full_name ?? a.client_id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Workouts */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Treinos do programa</h2>
        <NovoWorkout programId={id} />
      </div>

      {(!workouts || workouts.length === 0) ? (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Ainda não há treinos definidos. Adiciona o primeiro.
        </div>
      ) : (
        Array.from(porSemana.entries()).map(([semana, ws]) => (
          <div key={semana} className="flex flex-col gap-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--muted-foreground)' }}>Semana {semana}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ws!.map((w) => (
                <div key={w.id} className="rounded-2xl border p-4 flex flex-col gap-1" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: '#2d71e022', color: 'var(--accent)' }}>{w.tipo}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{w.dia}</span>
                  </div>
                  <div className="font-bold text-sm">{w.titulo}</div>
                  {w.descricao && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{w.descricao}</p>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
