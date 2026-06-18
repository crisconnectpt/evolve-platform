import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NovaSessao from './NovaSessao'
import SessaoActions from './SessaoActions'

const estadoLabel: Record<string, { label: string; bg: string; color: string }> = {
  disponivel: { label: 'Disponível', bg: '#2d71e022', color: 'var(--accent)' },
  reservado:  { label: 'Reservado',  bg: '#ffd70022', color: '#ffd700' },
  concluido:  { label: 'Concluído',  bg: '#4ecdc422', color: '#4ecdc4' },
  cancelado:  { label: 'Cancelado',  bg: '#ff4d4d22', color: '#ff6b6b' },
}

export default async function PTPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: sessoes } = await supabase
    .from('pt_sessions')
    .select('id, titulo, descricao, data_hora, duracao_min, preco, link_video, estado, client_id, profiles:client_id(full_name)')
    .eq('coach_id', user.id)
    .order('data_hora', { ascending: true })

  const disponiveis = (sessoes ?? []).filter(s => s.estado === 'disponivel')
  const reservadas  = (sessoes ?? []).filter(s => s.estado === 'reservado')
  const historico   = (sessoes ?? []).filter(s => s.estado === 'concluido' || s.estado === 'cancelado')

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">PT Online</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Cria slots de sessões individuais para os teus clientes reservarem e pagarem online.
          </p>
        </div>
        <NovaSessao />
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Slots disponíveis', value: disponiveis.length },
          { label: 'Sessões reservadas', value: reservadas.length },
          { label: 'Sessões concluídas', value: historico.filter(s => s.estado === 'concluido').length },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4 flex flex-col gap-1" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Reservadas */}
      {reservadas.length > 0 && (
        <Section title="🔥 Reservadas — próximas sessões">
          {reservadas.map(s => <SessaoCard key={s.id} s={s} showClient />)}
        </Section>
      )}

      {/* Disponíveis */}
      {disponiveis.length > 0 && (
        <Section title="📅 Slots disponíveis">
          {disponiveis.map(s => <SessaoCard key={s.id} s={s} />)}
        </Section>
      )}

      {disponiveis.length === 0 && reservadas.length === 0 && (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Ainda não tens sessões PT criadas. Clica em "+ Nova sessão PT" para começar.
        </div>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <Section title="📋 Histórico">
          {historico.map(s => <SessaoCard key={s.id} s={s} showClient />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
    </div>
  )
}

function SessaoCard({ s, showClient }: { s: any; showClient?: boolean }) {
  const e = estadoLabel[s.estado] ?? estadoLabel.disponivel
  const dataHora = new Date(s.data_hora)

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: e.bg, color: e.color }}>{e.label}</span>
        <span className="font-black text-lg">{s.preco}€</span>
      </div>
      <div>
        <p className="font-bold">{s.titulo}</p>
        {s.descricao && <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.descricao}</p>}
      </div>
      <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <span>📅 {dataHora.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        <span>🕐 {dataHora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {s.duracao_min} min</span>
        {showClient && s.profiles?.full_name && <span>👤 {s.profiles.full_name}</span>}
        {s.link_video && <a href={s.link_video} target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: 'var(--accent)' }}>🔗 Link da sessão</a>}
      </div>
      <SessaoActions id={s.id} estado={s.estado} />
    </div>
  )
}
