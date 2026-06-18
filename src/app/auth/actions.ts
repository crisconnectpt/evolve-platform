'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const plano = formData.get('plano') as string | null
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: `${formData.get('nome')} ${formData.get('apelido')}`,
        objetivo: formData.get('objetivo') ?? '',
        role: 'client',
      },
    },
  })
  if (error) return { error: error.message }
  redirect(plano ? `/onboarding?plano=${plano}` : '/onboarding')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
