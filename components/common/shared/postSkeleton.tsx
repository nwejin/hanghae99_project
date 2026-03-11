import { Skeleton } from '../ui';

export function PostSkeleton() {
  return (
    <div className="px-1 py-2">
      {/* 날짜 헤더 스켈레톤 */}
      <div className="flex items-center gap-1.5 px-3 py-2">
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>
      {/* 3열 그리드 스켈레톤 */}
      <div className="grid grid-cols-3 gap-1 px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    </div>
  );
}
