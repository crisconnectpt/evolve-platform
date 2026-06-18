'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/auth/actions'

const coachLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/treinos', label: 'Treinos', icon: '🏋️' },
  { href: '/dashboard/pt', label: 'PT Online', icon: '🎯' },
  { href: '/dashboard/check-ins', label: 'Check-ins', icon: '✅' },
  { href: '/dashboard/mensagens', label: 'Mensagens', icon: '💬' },
  { href: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
  { href: '/dashboard/comunidade', label: 'Comunidade SRC', icon: '🏃' },
]

const clientLinks = [
  { href: '/dashboard/cliente', label: 'Início', icon: '⚡' },
  { href: '/dashboard/cliente/treino', label: 'O meu treino', icon: '🏋️' },
  { href: '/dashboard/cliente/pt', label: 'PT Online', icon: '🎯' },
  { href: '/dashboard/cliente/check-in', label: 'Check-in', icon: '✅' },
  { href: '/dashboard/cliente/mensagens', label: 'Mensagens', icon: '💬' },
  { href: '/dashboard/cliente/comunidade', label: 'Comunidade SRC', icon: '🏃' },
  { href: '/dashboard/cliente/conta', label: 'A minha conta', icon: '👤' },
]

export default function Sidebar({ role, name }: { role: string; name: string }) {
  const pathname = usePathname()
  const links = role === 'coach' || role === 'admin' ? coachLinks : clientLinks
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside
      className="w-60 min-h-screen flex flex-col border-r py-6 px-4 gap-1"
      style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
    >
      <div className="px-2 mb-8">
        <span className="text-lg font-black tracking-tight">
          EVOLVE<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#ffffff' : 'var(--muted-foreground)',
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            {initials || 'ES'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold truncate">{name}</span>
            <span className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>{role}</span>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs mt-1 transition-colors w-full text-left"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span>🚪</span> Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
