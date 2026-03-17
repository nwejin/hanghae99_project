import { Skeleton } from '../ui';

export function CommentSkeleton() {
  return (
    <div className="space-y-3 px-4 py-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-2">
          <Skeleton className="h-7 w-7 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
