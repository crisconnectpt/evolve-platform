import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="text-center flex flex-col gap-6 max-w-sm">
        <div>
          <span className="text-8xl font-black tracking-tighter" style={{ color: 'var(--accent)' }}>
            404
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-black">Página não encontrada</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            A página que procuras não existe ou foi movida.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Ir para a página inicial
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl font-bold text-sm border"
            style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}
          >
            Ir para o dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
