import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'coach' && profile?.role !== 'admin') redirect('/dashboard/cliente')

  const { data: clientesData } = await supabase
    .from('profiles')
    .select('id, full_name, objetivo, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  const ids = (clientesData ?? []).map((c) => c.id)
  const { data: subs } = ids.length
    ? await supabase.from('subscriptions').select('client_id, plano, status').in('client_id', ids)
    : { data: [] as any[] }

  const subsMap = new Map((subs ?? []).map((s) => [s.client_id, s]))

  const clientes = (clientesData ?? []).map((c) => {
    const sub = subsMap.get(c.id)
    return {
      ...c,
      avatar: (c.full_name ?? '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase(),
      plano: sub?.plano ? (sub.plano === 'premium' ? 'Premium' : 'Standard') : 'Sem plano',
      status: sub?.status === 'active' ? 'activo' : 'inactivo',
    }
  })

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Clientes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {clientes.filter((c) => c.status === 'activo').length} activos · {clientes.length} total
          </p>
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-2xl border p-6 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
          Ainda não há clientes registados. Quando alguém se registar na plataforma, vai aparecer aqui.
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)', background: 'var(--card)' }}>
                <th className="text-left px-5 py-3">Cliente</th>
                <th className="text-left px-5 py-3">Objetivo</th>
                <th className="text-left px-5 py-3">Plano</th>
                <th className="text-left px-5 py-3">Registo</th>
                <th className="text-left px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b text-sm"
                  style={{
                    borderColor: 'var(--card-border)',
                    background: i % 2 === 0 ? 'var(--background)' : 'var(--card)',
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--accent)', color: '#ffffff' }}
                      >
                        {c.avatar}
                      </div>
                      <div className="font-medium">{c.full_name ?? '—'}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--muted-foreground)' }}>{c.objetivo ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: c.plano === 'Premium' ? '#2d71e022' : 'var(--muted)',
                        color: c.plano === 'Premium' ? 'var(--accent)' : 'var(--muted-foreground)',
                      }}
                    >
                      {c.plano}
                    </span>
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--muted-foreground)' }}>
                    {new Date(c.created_at).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: c.status === 'activo' ? '#2d71e022' : '#ff4d4d22',
                        color: c.status === 'activo' ? 'var(--accent)' : '#ff6b6b',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
