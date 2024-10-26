import { Card } from '@/components/common';

export function PostEnd() {
  return (
    <Card.Card className="max-w-lg border-none bg-inherit p-3 shadow-none">
      <Card.CardContent className="flex justify-center p-0">
        <p className="text-primary opacity-70">모든 게시글을 확인했습니다.</p>
      </Card.CardContent>
    </Card.Card>
  );
}
