import { Skeleton } from '../ui';
import { PostSkeleton } from './postSkeleton';

export function ProfileSkeleton() {
  return (
    <div className="px-4 py-6">
      {/* 프로필 헤더 */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="mt-3 h-5 w-24" />
        <Skeleton className="mt-1.5 h-4 w-40" />
      </div>

      {/* 펫 카드 */}
      <div className="mt-5 flex flex-col gap-2">
        <Skeleton className="h-[72px] w-full rounded-2xl" />
      </div>

      {/* 게시물 수 */}
      <div className="mt-5 flex items-center gap-1.5">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="my-3 h-px bg-paw-border" />

      {/* 게시물 그리드 */}
      <PostSkeleton />
    </div>
  );
}
