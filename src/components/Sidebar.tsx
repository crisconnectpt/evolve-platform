'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logout } from '@/app/auth/actions'
import {
  LayoutDashboard, Dumbbell, Target, CheckSquare, MessageCircle,
  Users, Timer, Home, User, LogOut, X, TrendingUp, type LucideIcon,
} from 'lucide-react'

const coachLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/treinos', label: 'Treinos', icon: Dumbbell },
  { href: '/dashboard/pt', label: 'PT Online', icon: Target },
  { href: '/dashboard/check-ins', label: 'Check-ins', icon: CheckSquare },
  { href: '/dashboard/mensagens', label: 'Mensagens', icon: MessageCircle },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/comunidade', label: 'Comunidade SRC', icon: Timer },
]

const clientLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard/cliente', label: 'Início', icon: Home },
  { href: '/dashboard/cliente/treino', label: 'O meu treino', icon: Dumbbell },
  { href: '/dashboard/cliente/pt', label: 'PT Online', icon: Target },
  { href: '/dashboard/cliente/check-in', label: 'Check-in', icon: CheckSquare },
  { href: '/dashboard/cliente/mensagens', label: 'Mensagens', icon: MessageCircle },
  { href: '/dashboard/cliente/progresso', label: 'O meu progresso', icon: TrendingUp },
  { href: '/dashboard/cliente/comunidade', label: 'Comunidade SRC', icon: Timer },
  { href: '/dashboard/cliente/conta', label: 'A minha conta', icon: User },
]

export default function Sidebar({ role, name }: { role: string; name: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const links = role === 'coach' || role === 'admin' ? coachLinks : clientLinks
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  // Fechar ao navegar
  useEffect(() => { setOpen(false) }, [pathname])

  // Fechar ao pressionar Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const sidebarContent = (
    <aside
      className="w-60 min-h-screen flex flex-col border-r py-6 px-4 gap-1"
      style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
    >
      <div className="px-2 mb-8 flex items-center justify-between">
        <Image src="/evolve-logo-claim.png" alt="Evolve Studio" width={110} height={26} priority />
        {/* Fechar no mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <X size={18} />
        </button>
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
              <link.icon size={16} strokeWidth={2} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
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
            <LogOut size={14} /> Sair
          </button>
        </form>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile — hamburger */}
      <div className="md:hidden">
        {/* Barra topo mobile */}
        <div
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <Image src="/evolve-logo-claim.png" alt="Evolve Studio" width={100} height={24} priority />
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Abrir menu"
          >
            <span className="block w-6 h-0.5 rounded" style={{ background: 'var(--foreground)' }} />
            <span className="block w-6 h-0.5 rounded" style={{ background: 'var(--foreground)' }} />
            <span className="block w-6 h-0.5 rounded" style={{ background: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Espaço para a barra fixa */}
        <div className="h-14" />

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className="fixed top-0 left-0 h-full z-50 transition-transform duration-300"
          style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  )
}
