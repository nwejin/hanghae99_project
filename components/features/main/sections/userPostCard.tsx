'use client';

import Image from 'next/image';
import { Images } from 'lucide-react';

interface PostThumbnailProps {
  post: {
    id: string;
    imgUrls: string[];
    [key: string]: any;
  };
  user: {
    nickname: string;
    profile_image: string;
    [key: string]: any;
  };
  onSelect: () => void;
}

export default function PostThumbnail({ post, user, onSelect }: PostThumbnailProps) {
  return (
    <button
      className="relative aspect-square overflow-hidden rounded-md border border-gray-100"
      onClick={onSelect}
    >
      {post.imgUrls?.[0] ? (
        <Image
          src={post.imgUrls[0]}
          fill
          alt="게시물"
          className="object-cover transition-transform duration-200 hover:scale-105"
          sizes="(max-width: 576px) 33vw, 192px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-paw-cream-dark text-xs text-paw-inactive">
          이미지 없음
        </div>
      )}
      {post.imgUrls?.length > 1 && (
        <div className="absolute right-1.5 top-1.5 rounded bg-black/40 p-0.5">
          <Images size={14} className="text-white" />
        </div>
      )}
    </button>
  );
}
