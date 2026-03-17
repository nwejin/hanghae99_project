import { Skeleton } from '../ui';
import { PostSkeleton } from './postSkeleton';

export function FeedSkeleton() {
  return (
    <>
      {/* 필터바 스켈레톤 */}
      <div className="sticky top-0 z-10 border-b border-paw-border bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>

      {/* 게시물 그리드 스켈레톤 x2 */}
      <PostSkeleton />
      <PostSkeleton />
    </>
  );
}
