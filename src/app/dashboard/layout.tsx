import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'client'
  const name = profile?.full_name ?? user.email ?? 'Utilizador'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar role={role} name={name} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
