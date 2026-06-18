import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, onboarding_completo')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'client'
  const name = profile?.full_name ?? user.email ?? 'Utilizador'

  // Redirecionar clientes novos para onboarding
  if (role === 'client' && !profile?.onboarding_completo) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar role={role} name={name} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar com sino */}
        <div
          className="hidden md:flex items-center justify-end px-8 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--card-border)', background: 'var(--background)' }}
        >
          <NotificationBell userId={user.id} />
        </div>
        {children}
      </div>
    </div>
  )
}
