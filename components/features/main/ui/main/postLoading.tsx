import MoonLoader from 'react-spinners/MoonLoader';
import { Card } from '@/components/common';

export function PostLoading() {
  return (
    <Card.Card className="max-w-lg p-3">
      <Card.CardContent className="flex justify-center p-0">
        <MoonLoader color="#FF9022" size={30} speedMultiplier={0.7} />
      </Card.CardContent>
    </Card.Card>
  );
}
