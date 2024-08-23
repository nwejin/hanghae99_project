import { Button } from '@/components/ui/button';
import { Heart, Send, MessageCircle } from 'lucide-react';
import { addLike, removeLike, isLiked } from '@/lib/postLike';
import { useState, useEffect } from 'react';

interface ButtonsProps {
  postId: string;
  userId: string | null;
}

export default function Buttons({ postId, userId }: ButtonsProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchLikeStatus = async () => {
        const likedStatus = await isLiked(postId, userId);
        setLiked(likedStatus);
      };

      fetchLikeStatus();
    }
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId) {
      return;
    }
    if (liked) {
      await removeLike(postId, userId);
      setLiked(false);
    } else {
      await addLike(postId, userId);
      setLiked(true);
    }
  };

  return (
    <>
      <div className="flex w-full items-center">
        <Button variant="ghost" size="icon" onClick={handleLike}>
          <Heart className="h-4 w-4" fill={liked ? 'red' : 'white'} />
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
