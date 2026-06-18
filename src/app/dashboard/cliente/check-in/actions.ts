'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarCheckin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const hoje = new Date()
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1) // segunda-feira

  const { error } = await supabase.from('checkins').insert({
    client_id: user.id,
    semana_inicio: inicioSemana.toISOString().slice(0, 10),
    rating: Number(formData.get('rating')),
    energia: Number(formData.get('energia')),
    sono: Number(formData.get('sono')),
    treinos_feitos: Number(formData.get('treinos_feitos')),
    nota_cliente: formData.get('nota') as string,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/cliente/check-in')
  revalidatePath('/dashboard/cliente')
  return { success: true }
}
