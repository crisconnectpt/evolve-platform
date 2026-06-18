'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inscrever(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('event_registrations').insert({
    event_id: eventId,
    client_id: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/cliente/comunidade')
  return { success: true }
}

export async function desinscrever(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('client_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/cliente/comunidade')
  return { success: true }
}
