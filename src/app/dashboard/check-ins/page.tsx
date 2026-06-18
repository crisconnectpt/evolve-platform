import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckinCard from './CheckinCard'

export default async function CheckInsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: checkins } = await supabase
    .from('checkins')
    .select('id, created_at, rating, energia, sono, treinos_feitos, nota_cliente, resposta_coach, respondido, profiles:client_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(30)

  const porResponder = (checkins ?? []).filter((c) => !c.respondido)
  const respondidos = (checkins ?? []).filter((c) => c.respondido)

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Check-ins</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {porResponder.length} por responder · {respondidos.length} respondidos
        </p>
      </div>

      {(!checkins || checkins.length === 0) ? (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Ainda não há check-ins submetidos pelos clientes.
        </div>
      ) : (
        <>
          {porResponder.length > 0 && (
            <div>
              <h2 className="font-bold mb-4">Por responder</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {porResponder.map((c) => <CheckinCard key={c.id} checkin={c} />)}
              </div>
            </div>
          )}
          {respondidos.length > 0 && (
            <div>
              <h2 className="font-bold mb-4">Respondidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {respondidos.map((c) => <CheckinCard key={c.id} checkin={c} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
