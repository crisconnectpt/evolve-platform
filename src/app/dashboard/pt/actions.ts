'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarSessaoPT(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('pt_sessions').insert({
    coach_id: user.id,
    titulo: formData.get('titulo') as string,
    descricao: formData.get('descricao') as string,
    data_hora: formData.get('data_hora') as string,
    duracao_min: Number(formData.get('duracao_min')) || 60,
    preco: Number(formData.get('preco')),
    link_video: formData.get('link_video') as string,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/pt')
  return { success: true }
}

export async function cancelarSessaoPT(sessionId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pt_sessions')
    .update({ estado: 'cancelado' })
    .eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/pt')
  return { success: true }
}

export async function concluirSessaoPT(sessionId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pt_sessions')
    .update({ estado: 'concluido' })
    .eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/pt')
  return { success: true }
}
