import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

export function LoadingSkeleton({ 
  className, 
  width = "100%", 
  height = "1rem" 
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <LoadingSkeleton width="60%" height={24} />
      <LoadingSkeleton width="100%" height={16} />
      <LoadingSkeleton width="80%" height={16} />
      <div className="flex gap-2">
        <LoadingSkeleton width={60} height={20} />
        <LoadingSkeleton width={80} height={20} />
        <LoadingSkeleton width={70} height={20} />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-shrink-0 order-1 lg:order-1">
        <LoadingSkeleton 
          className="w-48 h-48 lg:w-64 lg:h-64 rounded-full" 
        />
      </div>
      <div className="flex-1 max-w-2xl order-2 lg:order-2 text-center lg:text-left space-y-4">
        <LoadingSkeleton width="80%" height={48} />
        <LoadingSkeleton width="100%" height={24} />
        <LoadingSkeleton width="90%" height={24} />
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
          <LoadingSkeleton width={120} height={16} />
          <LoadingSkeleton width={140} height={16} />
        </div>
      </div>
    </div>
  )
} 