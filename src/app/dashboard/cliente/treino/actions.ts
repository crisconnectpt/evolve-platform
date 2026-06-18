'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleTreino(workoutId: string, concluido: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: existing } = await supabase
    .from('workout_logs')
    .select('id')
    .eq('client_id', user.id)
    .eq('workout_id', workoutId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('workout_logs')
      .update({ concluido, data_treino: new Date().toISOString().slice(0, 10) })
      .eq('id', existing.id)
  } else {
    await supabase.from('workout_logs').insert({
      client_id: user.id,
      workout_id: workoutId,
      concluido,
      data_treino: new Date().toISOString().slice(0, 10),
    })
  }

  revalidatePath('/dashboard/cliente/treino')
  return { success: true }
}
