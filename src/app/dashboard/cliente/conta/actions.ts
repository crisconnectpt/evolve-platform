'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function atualizarPerfil(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const full_name = formData.get('full_name') as string
  const objetivo = formData.get('objetivo') as string
  const telefone = formData.get('telefone') as string

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, objetivo, telefone })
    .eq('id', user.id)

  revalidatePath('/dashboard/cliente/conta')
}
