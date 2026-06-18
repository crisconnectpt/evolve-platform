'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarPrograma(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('programs').insert({
    titulo: formData.get('titulo') as string,
    descricao: formData.get('descricao') as string,
    semanas: Number(formData.get('semanas')) || 4,
    nivel: formData.get('nivel') as string,
    tag: formData.get('tag') as string,
    coach_id: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/treinos')
  return { success: true }
}

export async function criarWorkout(programId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('workouts').insert({
    program_id: programId,
    semana: Number(formData.get('semana')) || 1,
    dia: formData.get('dia') as string,
    tipo: formData.get('tipo') as string,
    titulo: formData.get('titulo') as string,
    descricao: formData.get('descricao') as string,
  })

  if (error) return { error: error.message }
  revalidatePath(`/dashboard/treinos/${programId}`)
  return { success: true }
}

export async function atribuirPrograma(programId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const clientId = formData.get('client_id') as string

  // desactiva atribuições anteriores deste cliente
  await supabase.from('client_programs').update({ activo: false }).eq('client_id', clientId).eq('activo', true)

  const { error } = await supabase.from('client_programs').insert({
    client_id: clientId,
    program_id: programId,
    coach_id: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath(`/dashboard/treinos/${programId}`)
  revalidatePath('/dashboard/cliente')
  return { success: true }
}

export async function removerWorkout(programId: string, workoutId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('workouts').delete().eq('id', workoutId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/treinos/${programId}`)
  return { success: true }
}
