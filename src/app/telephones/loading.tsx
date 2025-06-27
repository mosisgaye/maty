// app/telephones/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function TelephonesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="bg-muted h-96 mb-8 rounded-lg animate-pulse" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter skeleton */}
        <div className="lg:col-span-1">
          <Skeleton className="h-96" />
        </div>
        
        {/* Results skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}