'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function enviarMensagem(receiverId: string, conteudo: string, revalidate: string) {
  if (!conteudo.trim()) return { error: 'Mensagem vazia' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    conteudo: conteudo.trim(),
  })

  if (error) return { error: error.message }
  revalidatePath(revalidate)
  return { success: true }
}

export async function marcarLidas(senderId: string, receiverId: string) {
  const supabase = await createClient()
  await supabase
    .from('messages')
    .update({ lida: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .eq('lida', false)
}
