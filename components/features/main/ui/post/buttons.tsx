'use client';

import { Button } from '@/components/common';
import { Heart, Send, MessageCircle } from 'lucide-react';
// import { addLike, removeLike, isLiked } from '@/lib/postLike';
import { useState, useEffect } from 'react';
import { addLike, deleteLike, getLike } from '@/lib/like';

interface ButtonsProps {
  postId: string;
  userId: string | null;
  modal?: () => void;
}

export default function Buttons({ postId, userId, modal }: ButtonsProps) {
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

  const likeData = { postId };

  const handleLike = async () => {
    if (!userId) {
      return;
    }

    // 좋아요 클릭시 먼저 ui 변경
    const likeUpdate = !liked;
    setLiked(likeUpdate);

    try {
      if (likeUpdate) {
        await addLike(likeData);
      } else {
        await deleteLike(likeData);
      }
    } catch (error) {
      // 서버 요청 실패시 원상태로
      setLiked(liked);
      console.error('좋아요 업데이트 실패:', error);
    }
  };

  return (
    <>
      <div className="flex w-full items-center">
        <Button variant="ghost" size="icon" onClick={handleLike}>
          <Heart className="h-4 w-4" fill={liked ? 'red' : 'white'} strokeWidth={liked ? 0 : 2} />
          <span className="sr-only">Like</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={modal}>
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
