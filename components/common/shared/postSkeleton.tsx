import { Skeleton } from '../ui';
import { Card } from '@/components/common';

export function PostSkeleton() {
  return (
    <Card.Card className="mb-5 h-[40rem] max-w-lg overflow-hidden rounded-xl">
      <Card.CardHeader className="flex flex-row items-center p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-4 space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </Card.CardHeader>

      <Card.CardContent className="relative p-0">
        <Skeleton className="h-[28rem] w-full" />
      </Card.CardContent>

      <Card.CardFooter className="grid gap-2 p-2 pb-4">
        <Skeleton className="h-4 w-[60px]" />
        <div className="w-full space-y-2 px-2 text-sm">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
