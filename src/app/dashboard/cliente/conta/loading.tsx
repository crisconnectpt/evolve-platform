import { Skeleton } from '@/components/Skeleton'

export default function ContaLoading() {
  return (
    <div className="p-6 md:p-10 max-w-2xl w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex items-center gap-5">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border p-6 flex flex-col gap-4" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
