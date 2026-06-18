import { Skeleton, SkeletonRow } from '@/components/Skeleton'

export default function CheckInsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-4xl w-full">
      <Skeleton className="h-8 w-40" />
      <div
        className="rounded-2xl border divide-y"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6">
            <SkeletonRow />
          </div>
        ))}
      </div>
    </div>
  )
}
