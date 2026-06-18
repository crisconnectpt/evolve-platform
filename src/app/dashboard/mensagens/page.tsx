import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChatBox from '@/components/ChatBox'

export default async function MensagensCoachPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>
}) {
  const { cliente: clienteId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente/mensagens')

  // Lista de clientes com última mensagem
  const { data: clientes } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'client')
    .order('full_name')

  // Chat com cliente seleccionado
  let chatMessages: any[] = []
  let clienteSel: { id: string; full_name: string } | null = null

  if (clienteId) {
    clienteSel = clientes?.find((c) => c.id === clienteId) ?? null

    const { data: msgs } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, conteudo, created_at, lida')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${clienteId}),and(sender_id.eq.${clienteId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })

    chatMessages = msgs ?? []

    // Marcar como lidas
    await supabase
      .from('messages')
      .update({ lida: true })
      .eq('sender_id', clienteId)
      .eq('receiver_id', user.id)
      .eq('lida', false)
  }

  // Contagem de não lidas por cliente
  const { data: naoLidas } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('receiver_id', user.id)
    .eq('lida', false)

  const naoLidasMap = new Map<string, number>()
  for (const m of naoLidas ?? []) {
    naoLidasMap.set(m.sender_id, (naoLidasMap.get(m.sender_id) ?? 0) + 1)
  }

  return (
    <div className="flex h-screen" style={{ maxHeight: 'calc(100vh - 0px)' }}>
      {/* Lista de clientes */}
      <div className="w-64 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--card-border)', background: 'var(--card)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h1 className="font-black text-lg">Mensagens</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{clientes?.length ?? 0} clientes</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(!clientes || clientes.length === 0) ? (
            <p className="text-xs p-4" style={{ color: 'var(--muted-foreground)' }}>Sem clientes registados.</p>
          ) : (
            clientes.map((c) => {
              const naoLida = naoLidasMap.get(c.id) ?? 0
              const active = c.id === clienteId
              const initials = (c.full_name ?? '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
              return (
                <Link
                  key={c.id}
                  href={`/dashboard/mensagens?cliente=${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ background: active ? '#2d71e022' : 'transparent', borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent' }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--accent)', color: '#ffffff' }}>
                    {initials}
                  </div>
                  <span className="text-sm font-medium flex-1 truncate">{c.full_name}</span>
                  {naoLida > 0 && (
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', color: '#ffffff' }}>
                      {naoLida}
                    </span>
                  )}
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col p-4" style={{ minHeight: 0 }}>
        {clienteSel ? (
          <ChatBox
            currentUserId={user.id}
            currentUserName={profile?.full_name ?? 'Coach'}
            otherId={clienteSel.id}
            otherName={clienteSel.full_name ?? 'Cliente'}
            initialMessages={chatMessages}
            revalidatePath="/dashboard/mensagens"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Selecciona um cliente para ver a conversa
          </div>
        )}
      </div>
    </div>
  )
}
