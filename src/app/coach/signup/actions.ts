'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function coachSignup(formData: FormData) {
  const codigoConvite = formData.get('codigo') as string
  if (codigoConvite !== process.env.COACH_INVITE_CODE) {
    return { error: 'Código de convite inválido.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: `${formData.get('nome')} ${formData.get('apelido')}`,
        role: 'coach',
        especializacao: formData.get('especializacao'),
        certificacoes: formData.get('certificacoes'),
      },
    },
  })

  if (error) return { error: error.message }
  redirect('/dashboard')
}
