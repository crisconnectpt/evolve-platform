import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckinForm from './CheckinForm'

export default async function CheckinPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: historico } = await supabase
    .from('checkins')
    .select('id, created_at, rating, energia, sono, treinos_feitos, resposta_coach, respondido')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-8 flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Check-in semanal</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Conta-nos como correu a semana para o teu coach ajustar o plano.
        </p>
      </div>

      <CheckinForm />

      {historico && historico.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-bold mt-4">Histórico</h2>
          {historico.map((c) => (
            <div key={c.id} className="rounded-2xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{new Date(c.created_at).toLocaleDateString('pt-PT')}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">{i < (c.rating ?? 0) ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Energia: {c.energia}/5</span>
                <span>Sono: {c.sono}h</span>
                <span>Treinos: {c.treinos_feitos}</span>
              </div>
              {c.resposta_coach && (
                <div className="mt-3 rounded-lg p-3 text-sm" style={{ background: '#2d71e022', color: 'var(--accent)' }}>
                  💬 {c.resposta_coach}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
