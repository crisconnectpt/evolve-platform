import { Skeleton, SkeletonCard } from '@/components/Skeleton'

export default function PTLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-5xl w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
