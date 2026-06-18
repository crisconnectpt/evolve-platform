import { Skeleton } from '@/components/Skeleton'

export default function ProgressoLoading() {
  return (
    <div className="p-6 md:p-10 max-w-4xl w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-52 w-full rounded-2xl" />
      ))}
    </div>
  )
}
