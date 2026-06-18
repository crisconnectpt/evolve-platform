import { Skeleton, SkeletonCard, SkeletonRow } from '@/components/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-5xl w-full">
      {/* Título */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Secção inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
        <div
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </div>
  )
}
