import Link from 'next/link'
import Image from 'next/image'

const planos = [
  {
    id: 'starter',
    nome: 'Starter',
    preco: 29,
    periodo: '/mês',
    descricao: 'Para quem quer começar com o pé direito.',
    badge: null,
    features: [
      'Plano de treino semanal',
      'Check-in quinzenal com o coach',
      'Acesso à app e ao teu progresso',
      'Acesso à comunidade SRC',
    ],
    cta: 'Começar',
    destaque: false,
  },
  {
    id: 'standard',
    nome: 'Standard',
    preco: 49,
    periodo: '/mês',
    descricao: 'O equilíbrio perfeito entre acompanhamento e autonomia.',
    badge: 'Mais popular',
    features: [
      'Plano de treino semanal personalizado',
      'Check-in semanal com o coach',
      'Mensagens com resposta em 24h',
      'Acesso à app e ao teu progresso',
      'Comunidade Saturday Running Club',
      'Eventos e desafios mensais',
    ],
    cta: 'Escolher Standard',
    destaque: true,
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 89,
    periodo: '/mês',
    descricao: 'Acompanhamento de elite. Para quem quer o máximo.',
    badge: 'Elite',
    features: [
      'Tudo do Standard',
      'Acompanhamento diário',
      'Plano nutricional personalizado',
      'Análise de wearable (WHOOP / Garmin)',
      'Resposta prioritária — menos de 4h',
      'Sessão de avaliação mensal',
      'Acesso antecipado a eventos',
    ],
    cta: 'Escolher Premium',
    destaque: false,
  },
]

const metodologia = [
  {
    num: '01',
    titulo: 'Diagnóstico inicial',
    desc: 'Avaliação completa dos teus objetivos, disponibilidade e histórico de treino. O ponto de partida é único para cada atleta.',
  },
  {
    num: '02',
    titulo: 'Plano à tua medida',
    desc: 'Recebes um programa semanal ajustado ao teu nível, equipamento e estilo de vida. Sem copy-paste, sem planos genéricos.',
  },
  {
    num: '03',
    titulo: 'Check-in semanal',
    desc: 'Cada semana analisamos os teus resultados. O coach ajusta o plano em tempo real com base no teu feedback.',
  },
  {
    num: '04',
    titulo: 'Evolução contínua',
    desc: 'O teu plano cresce contigo. Progressão inteligente, prevenção de lesões, e objetivos que se renovam.',
  },
]

const modalidades = [
  { icon: '🏋️', nome: 'Força & Hipertrofia', desc: 'Musculação estruturada com periodização inteligente.' },
  { icon: '🏃', nome: 'Corrida & Endurance', desc: 'Preparação para provas, melhoria de pace e resistência.' },
  { icon: '⚡', nome: 'HYROX', desc: 'Treino funcional de alta intensidade para competição.' },
  { icon: '🤸', nome: 'Mobilidade & Saúde', desc: 'Movimento sem dor, longevidade e qualidade de vida.' },
  { icon: '🎯', nome: 'PT Online (sessões)', desc: 'Sessões individuais pontuais com o teu coach.' },
  { icon: '🏃‍♂️', nome: 'Saturday Running Club', desc: 'Comunidade de corrida presencial em Funchal.' },
]

const depoimentos = [
  {
    nome: 'Ana Freitas',
    cargo: 'Preparou o primeiro 10K',
    texto: 'Em 3 meses passei de não conseguir correr 2km a cruzar a linha de chegada dos 10K. O acompanhamento semanal fez toda a diferença.',
    inicial: 'AF',
  },
  {
    nome: 'Rodrigo Camacho',
    cargo: 'Atleta HYROX',
    texto: 'Nunca pensei que treinar online fosse tão personalizado. O coach ajusta tudo ao minuto. Os resultados falam por si.',
    inicial: 'RC',
  },
  {
    nome: 'Mariana Sousa',
    cargo: 'Perda de peso + força',
    texto: 'Perdi 12kg em 6 meses sem passar fome e com mais energia do que nunca. O plano nutricional foi o game changer.',
    inicial: 'MS',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
        style={{ background: 'rgba(10,10,10,0.85)', borderColor: 'var(--card-border)' }}
      >
        <Image src="/evolve-logo.svg" alt="Evolve Studio" width={130} height={31} priority />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
          <a href="#metodologia" className="hover:text-white transition-colors">Metodologia</a>
          <a href="#modalidades" className="hover:text-white transition-colors">Modalidades</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
            Entrar
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Começar
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-32 overflow-hidden">
        {/* Glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(104,143,200,0.18) 0%, transparent 70%)',
          }}
        />

        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border mb-8"
          style={{ borderColor: 'rgba(104,143,200,0.35)', color: 'var(--accent)', background: 'rgba(104,143,200,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: 'var(--accent)' }} />
          Funchal, Madeira · Armazém do Mercado
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none max-w-5xl mb-6">
          Treina com<br />
          <span style={{ color: 'var(--accent)' }}>propósito.</span><br />
          Evolui de verdade.
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Acompanhamento personalizado online com a metodologia do Evolve Studio.
          Força, corrida, HYROX e comunidade — tudo numa só plataforma.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signup"
            className="px-10 py-4 rounded-xl font-black text-base tracking-tight transition-transform hover:scale-105"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Começar agora — é grátis
          </Link>
          <a
            href="#planos"
            className="px-10 py-4 rounded-xl font-semibold text-base border transition-colors hover:border-white/30"
            style={{ borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
          >
            Ver planos
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {[
            { val: '200+', label: 'Atletas acompanhados' },
            { val: '4.9★', label: 'Avaliação média' },
            { val: '3×', label: 'Mais resultados vs. ginásio' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-black" style={{ color: 'var(--accent)' }}>{s.val}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── METODOLOGIA ── */}
      <section id="metodologia" className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Como funciona</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">O método Evolve</h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Uma abordagem estruturada, científica e humana. Não existem atalhos — existem sistemas que funcionam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metodologia.map((item) => (
            <div
              key={item.num}
              className="rounded-2xl border p-8 flex gap-6 group hover:border-blue-500/40 transition-colors"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <span
                className="text-5xl font-black leading-none flex-shrink-0 tabular-nums"
                style={{ color: 'rgba(104,143,200,0.25)' }}
              >
                {item.num}
              </span>
              <div>
                <h3 className="text-lg font-black mb-2">{item.titulo}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODALIDADES ── */}
      <section id="modalidades" className="px-6 py-24 w-full" style={{ background: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Especialidades</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">O que treinamos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modalidades.map((m) => (
              <div
                key={m.nome}
                className="rounded-2xl border p-6 flex flex-col gap-3 hover:border-blue-500/40 transition-colors cursor-default"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)' }}
              >
                <span className="text-3xl">{m.icon}</span>
                <h3 className="font-black text-base">{m.nome}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Preços</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">Escolhe o teu plano</h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Sem contratos longos. Cancela quando quiseres. Começa hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="rounded-2xl border flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1"
              style={{
                background: plano.destaque ? 'var(--accent)' : 'var(--card)',
                borderColor: plano.destaque ? 'transparent' : 'var(--card-border)',
              }}
            >
              {plano.badge && (
                <div
                  className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full"
                  style={{
                    background: plano.destaque ? 'rgba(255,255,255,0.2)' : 'rgba(104,143,200,0.15)',
                    color: plano.destaque ? '#ffffff' : 'var(--accent)',
                  }}
                >
                  {plano.badge}
                </div>
              )}

              <div className="p-8 flex flex-col gap-6 flex-1">
                <div>
                  <h3
                    className="text-xl font-black mb-1"
                    style={{ color: plano.destaque ? '#ffffff' : 'var(--foreground)' }}
                  >
                    {plano.nome}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: plano.destaque ? 'rgba(255,255,255,0.75)' : 'var(--muted-foreground)' }}
                  >
                    {plano.descricao}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-5xl font-black tabular-nums"
                    style={{ color: plano.destaque ? '#ffffff' : 'var(--foreground)' }}
                  >
                    €{plano.preco}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: plano.destaque ? 'rgba(255,255,255,0.6)' : 'var(--muted-foreground)' }}
                  >
                    {plano.periodo}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plano.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: plano.destaque ? 'rgba(255,255,255,0.9)' : 'var(--foreground)' }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: plano.destaque ? 'rgba(255,255,255,0.25)' : 'rgba(104,143,200,0.15)',
                          color: plano.destaque ? '#ffffff' : 'var(--accent)',
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="block text-center py-3.5 rounded-xl font-black text-sm transition-opacity hover:opacity-90"
                  style={{
                    background: plano.destaque ? '#ffffff' : 'var(--accent)',
                    color: plano.destaque ? 'var(--accent)' : '#ffffff',
                  }}
                >
                  {plano.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* PT Online destaque */}
        <div
          className="mt-6 rounded-2xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(104,143,200,0.12)' }}
            >
              🎯
            </div>
            <div>
              <h3 className="font-black text-lg">PT Online — Sessão Individual</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Reserva uma sessão pontual com o coach, sem subscrição. Ideal para avaliações, dúvidas ou acompanhamento esporádico.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black">A partir de €30</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>por sessão</div>
            </div>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl font-black text-sm whitespace-nowrap"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Reservar sessão
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="px-6 py-24 w-full" style={{ background: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Resultados reais</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">O que dizem os atletas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((d) => (
              <div
                key={d.nome}
                className="rounded-2xl border p-7 flex flex-col gap-5"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)' }}
              >
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--muted-foreground)' }}>
                  &ldquo;{d.texto}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'var(--accent)', color: '#ffffff' }}
                  >
                    {d.inicial}
                  </div>
                  <div>
                    <div className="text-sm font-black">{d.nome}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SRC BANNER ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div
          className="rounded-3xl border p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(104,143,200,0.1) 0%, transparent 70%)' }}
          />
          <div className="flex-1 relative">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Comunidade</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2 mb-4">
              Saturday Running Club
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Todos os sábados, a comunidade Evolve sai à rua. Corridas em grupo, desafios, leaderboards e convívio.
              Presencial em Funchal, acompanhamento online para quem está fora da ilha.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Corridas em grupo', 'Desafios mensais', 'Leaderboard', 'Eventos especiais'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ borderColor: 'rgba(104,143,200,0.3)', color: 'var(--accent)', background: 'rgba(104,143,200,0.08)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 relative">
            <div
              className="w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center text-7xl md:text-8xl border-2"
              style={{ borderColor: 'rgba(104,143,200,0.2)', background: 'rgba(104,143,200,0.06)' }}
            >
              🏃
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-6 py-20 text-center">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-14 border relative overflow-hidden"
          style={{ background: 'var(--accent)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
          />
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white relative">
            Pronto para evoluir?
          </h2>
          <p className="mb-8 text-base relative" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Junta-te à comunidade Evolve. Sem compromissos. Cancela quando quiseres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link
              href="/signup"
              className="px-10 py-4 rounded-xl font-black text-base bg-white transition-opacity hover:opacity-90"
              style={{ color: 'var(--accent)' }}
            >
              Criar conta gratuita
            </Link>
            <a
              href="#planos"
              className="px-10 py-4 rounded-xl font-semibold text-base border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="px-6 py-20 w-full" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Contacto</span>
            <h2 className="text-4xl font-black tracking-tight mt-3">Fala connosco</h2>
            <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>
              Tens dúvidas? Estamos aqui para ajudar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '📍',
                titulo: 'Localização',
                linhas: ['Armazém do Mercado', 'Funchal, Madeira'],
              },
              {
                icon: '📱',
                titulo: 'Instagram',
                linhas: ['@evolvestudio.pt'],
              },
              {
                icon: '✉️',
                titulo: 'Email',
                linhas: ['info@evolvestudio.pt'],
              },
            ].map((c) => (
              <div
                key={c.titulo}
                className="rounded-2xl border p-6 flex flex-col gap-3 text-center"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)' }}
              >
                <div className="text-3xl">{c.icon}</div>
                <div className="font-black text-sm">{c.titulo}</div>
                {c.linhas.map((l) => (
                  <div key={l} className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-10 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/evolve-logo.svg" alt="Evolve Studio" width={110} height={26} />
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            <a href="#metodologia" className="hover:text-white transition-colors">Metodologia</a>
            <a href="#modalidades" className="hover:text-white transition-colors">Modalidades</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <Link href="/login" className="hover:text-white transition-colors">Entrar</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Criar conta</Link>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            © 2025 Evolve Studio · Funchal, Madeira
          </p>
        </div>
      </footer>

    </main>
  )
}
