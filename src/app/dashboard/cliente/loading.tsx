import { Skeleton, SkeletonCard, SkeletonRow } from '@/components/Skeleton'

export default function ClienteLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl w-full">
      {/* Saudação */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Cards de estado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Programa + checkin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </div>
  )
}
