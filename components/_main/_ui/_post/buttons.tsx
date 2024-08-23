import { Button } from '@/components/ui/button';
import { Heart, Send, MessageCircle } from 'lucide-react';

export default function Buttons() {
  return (
    <>
      <div className="flex w-full items-center">
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Like</span>
        </Button>
        <Button variant="ghost" size="icon">
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Comment</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </>
  );
}
