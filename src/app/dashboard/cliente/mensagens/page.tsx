import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatBox from '@/components/ChatBox'

export default async function MensagensClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
  if (profile?.role === 'coach' || profile?.role === 'admin') redirect('/dashboard/mensagens')

  // Encontrar o coach (primeiro coach disponível)
  const { data: coach } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('role', ['coach', 'admin'])
    .limit(1)
    .single()

  if (!coach) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-black mb-4">Mensagens</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Ainda não há coaches disponíveis.
        </p>
      </div>
    )
  }

  const { data: msgs } = await supabase
    .from('messages')
    .select('id, sender_id, receiver_id, conteudo, created_at, lida')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${coach.id}),and(sender_id.eq.${coach.id},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  // Marcar como lidas
  await supabase
    .from('messages')
    .update({ lida: true })
    .eq('sender_id', coach.id)
    .eq('receiver_id', user.id)
    .eq('lida', false)

  return (
    <div className="p-4 flex flex-col" style={{ height: 'calc(100vh - 32px)' }}>
      <ChatBox
        currentUserId={user.id}
        currentUserName={profile?.full_name ?? 'Cliente'}
        otherId={coach.id}
        otherName={coach.full_name ?? 'Coach'}
        initialMessages={msgs ?? []}
        revalidatePath="/dashboard/cliente/mensagens"
      />
    </div>
  )
}
