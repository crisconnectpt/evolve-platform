'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function responderCheckin(checkinId: string, resposta: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('checkins')
    .update({ resposta_coach: resposta, respondido: true, coach_id: user.id })
    .eq('id', checkinId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/check-ins')
  return { success: true }
}
