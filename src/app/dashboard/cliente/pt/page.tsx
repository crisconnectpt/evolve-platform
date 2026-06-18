import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReservarBtn from './ReservarBtn'

export default async function ClientePTPage({ searchParams }: { searchParams: Promise<{ sucesso?: string }> }) {
  const { sucesso } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: disponiveis }, { data: minhasSessoes }] = await Promise.all([
    supabase
      .from('pt_sessions')
      .select('id, titulo, descricao, data_hora, duracao_min, preco')
      .eq('estado', 'disponivel')
      .gte('data_hora', new Date().toISOString())
      .order('data_hora', { ascending: true }),
    supabase
      .from('pt_sessions')
      .select('id, titulo, data_hora, duracao_min, preco, estado, link_video')
      .eq('client_id', user.id)
      .order('data_hora', { ascending: false })
      .limit(10),
  ])

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Sessões PT Online</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Reserva uma sessão individual com o teu coach. Pagamento seguro via Stripe.
        </p>
      </div>

      {sucesso && (
        <div className="rounded-2xl border p-4 font-medium text-sm" style={{ background: '#688fc822', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          ✅ Pagamento confirmado! A tua sessão está reservada. O coach vai enviar-te o link da videochamada.
        </div>
      )}

      {/* Slots disponíveis */}
      <div>
        <h2 className="font-bold mb-4">📅 Slots disponíveis</h2>
        {disponiveis && disponiveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {disponiveis.map((s) => (
              <div key={s.id} className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    {new Date(s.data_hora).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="font-black text-xl">{s.preco}€</span>
                </div>
                <div>
                  <p className="font-bold">{s.titulo}</p>
                  {s.descricao && <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.descricao}</p>}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  🕐 {new Date(s.data_hora).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {s.duracao_min} min
                </div>
                <ReservarBtn sessionId={s.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
            Sem slots disponíveis de momento. Fala com o teu coach para agendar.
          </div>
        )}
      </div>

      {/* As minhas sessões */}
      {minhasSessoes && minhasSessoes.length > 0 && (
        <div>
          <h2 className="font-bold mb-4">📋 As minhas sessões</h2>
          <div className="flex flex-col gap-3">
            {minhasSessoes.map((s) => {
              const estadoMap: Record<string, { label: string; color: string }> = {
                reservado:  { label: 'Confirmada', color: '#ffd700' },
                concluido:  { label: 'Concluída',  color: '#4ecdc4' },
                cancelado:  { label: 'Cancelada',  color: '#ff6b6b' },
              }
              const e = estadoMap[s.estado] ?? { label: s.estado, color: 'var(--muted-foreground)' }

              return (
                <div key={s.id} className="rounded-2xl border p-4 flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{s.titulo}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(s.data_hora).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} · {new Date(s.data_hora).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {s.duracao_min} min
                    </span>
                    {s.link_video && s.estado === 'reservado' && (
                      <a href={s.link_video} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                        🔗 Entrar na sessão
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-black">{s.preco}€</span>
                    <span className="text-xs font-medium" style={{ color: e.color }}>{e.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
