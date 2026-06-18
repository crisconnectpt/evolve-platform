import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NovoPrograma from './NovoPrograma'

export default async function TreinosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: programas } = await supabase
    .from('programs')
    .select('id, titulo, descricao, semanas, nivel, tag')
    .order('created_at', { ascending: false })

  const programIds = (programas ?? []).map((p) => p.id)
  const counts: Record<string, number> = {}
  if (programIds.length > 0) {
    const { data: cps } = await supabase.from('client_programs').select('program_id').eq('activo', true).in('program_id', programIds)
    for (const cp of cps ?? []) counts[cp.program_id] = (counts[cp.program_id] ?? 0) + 1
  }

  const tagColors: Record<string, string> = {
    HYROX: '#ff6b6b',
    Corrida: '#4ecdc4',
    Híbrido: 'var(--accent)',
    Longevidade: '#a78bfa',
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Treinos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Programas e planos
          </p>
        </div>
        <NovoPrograma />
      </div>

      {(!programas || programas.length === 0) ? (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Ainda não criaste nenhum programa. Clica em "+ Novo programa" para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {programas.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/treinos/${p.id}`}
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <div className="flex items-center justify-between">
                {p.tag && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${tagColors[p.tag] ?? 'var(--accent)'}22`, color: tagColors[p.tag] ?? 'var(--accent)' }}>
                    {p.tag}
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.semanas} sem.</span>
              </div>
              <div className="font-bold text-sm leading-tight">{p.titulo}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.nivel}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{counts[p.id] ?? 0} clientes</span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Gerir →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
