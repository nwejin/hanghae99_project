import { Card } from '@/components/common';
import { Spinner } from '@/components/common';

export function PostLoading() {
  return (
    <Card.Card className="max-w-lg border-none bg-inherit p-3 shadow-none">
      <Card.CardContent className="flex justify-center p-0">
        <Spinner />
      </Card.CardContent>
    </Card.Card>
  );
}
