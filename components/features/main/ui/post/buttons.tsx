'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { addLike, deleteLike, getLike } from '@/lib/like';

interface ButtonsProps {
  postId: string;
  userId: string | null;
  onCommentClick?: () => void;
}

export default function Buttons({ postId, userId, onCommentClick }: ButtonsProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchLikeStatus = async () => {
        const likedStatus = await getLike(postId, userId);
        setLiked(likedStatus.isLiked);
      };
      fetchLikeStatus();
    }
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId) return;
    const likeUpdate = !liked;
    setLiked(likeUpdate);
    try {
      if (likeUpdate) {
        await addLike({ postId });
      } else {
        await deleteLike({ postId });
      }
    } catch {
      setLiked(liked);
    }
  };

  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <button onClick={handleLike} className="transition-transform active:scale-125">
        <Heart
          size={22}
          className={liked ? 'fill-paw-like text-paw-like' : 'text-paw-brown'}
          strokeWidth={liked ? 0 : 1.8}
        />
      </button>
      {onCommentClick && (
        <button onClick={onCommentClick} className="transition-transform active:scale-110">
          <MessageCircle size={22} className="text-paw-brown" strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
