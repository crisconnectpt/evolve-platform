'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarEvento(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('events').insert({
    titulo: formData.get('titulo') as string,
    data_evento: formData.get('data_evento') as string,
    local: formData.get('local') as string,
    distancia: formData.get('distancia') as string,
    max_participantes: Number(formData.get('max_participantes')) || null,
    tipo: 'run',
    created_by: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/comunidade')
  revalidatePath('/dashboard/cliente/comunidade')
  return { success: true }
}
