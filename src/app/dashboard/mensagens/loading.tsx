import { Skeleton } from '@/components/Skeleton'

export default function MensagensLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen">
      {/* Lista de conversas */}
      <div
        className="w-72 flex-shrink-0 border-r flex flex-col gap-2 p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <Skeleton className="h-6 w-32 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
      {/* Área de chat */}
      <div className="flex-1 flex flex-col justify-end gap-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-xl mt-4" />
      </div>
    </div>
  )
}
