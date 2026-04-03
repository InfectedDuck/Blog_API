'use client';

export function SkeletonLine({ width = '100%', height = '16px' }: { width?: string; height?: string }) {
  return (
    <div
      className="rounded-lg bg-surface-tertiary animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-surface-tertiary animate-pulse flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl">
      <div className="flex gap-2 mb-3">
        <SkeletonLine width="60px" height="22px" />
        <SkeletonLine width="80px" height="22px" />
      </div>
      <SkeletonLine width="75%" height="24px" />
      <div className="mt-3 space-y-2">
        <SkeletonLine width="100%" height="14px" />
        <SkeletonLine width="85%" height="14px" />
      </div>
      <div className="flex gap-3 mt-4">
        <SkeletonCircle size={20} />
        <SkeletonLine width="80px" height="14px" />
        <SkeletonLine width="60px" height="14px" />
      </div>
    </div>
  );
}

export function PostPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex gap-2 mb-4">
        <SkeletonLine width="70px" height="24px" />
        <SkeletonLine width="90px" height="24px" />
      </div>
      <SkeletonLine width="80%" height="36px" />
      <div className="flex gap-3 mt-4 mb-8">
        <SkeletonCircle size={24} />
        <SkeletonLine width="100px" height="16px" />
        <SkeletonLine width="80px" height="16px" />
      </div>
      <div className="space-y-3">
        <SkeletonLine width="100%" height="16px" />
        <SkeletonLine width="95%" height="16px" />
        <SkeletonLine width="100%" height="16px" />
        <SkeletonLine width="70%" height="16px" />
        <div className="h-4" />
        <SkeletonLine width="100%" height="16px" />
        <SkeletonLine width="90%" height="16px" />
        <SkeletonLine width="100%" height="16px" />
        <SkeletonLine width="60%" height="16px" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
