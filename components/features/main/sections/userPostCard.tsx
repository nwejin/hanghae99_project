'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TotalPostType } from '@/lib/post';
import DetailPage from './detailPage';

// post.id를 seed로 일관된 랜덤 크기 생성
function getGridSpan(id: string) {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mod = hash % 10;

  // 60% → 1x1, 20% → 2x1, 10% → 1x2, 10% → 2x2
  if (mod < 6) return { col: 1, row: 1 };
  if (mod < 8) return { col: 2, row: 1 };
  if (mod < 9) return { col: 1, row: 2 };
  return { col: 2, row: 2 };
}

export default function UserPostCard({ post, user }: TotalPostType) {
  const [isOpen, setIsOpen] = useState(false);
  const { col, row } = getGridSpan(post.id);
  const thumbnail = post.imgUrls[0];

  return (
    <>
      <div
        className="relative cursor-pointer overflow-hidden aspect-square border border-gray-200 shadow-sm"
        style={{ gridColumn: `span ${col}`, gridRow: `span ${row}` }}
        onClick={() => setIsOpen(true)}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt="게시글 이미지"
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 33vw, 200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            이미지 없음
          </div>
        )}

        {post.imgUrls.length > 1 && (
          <div className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
            +{post.imgUrls.length - 1}
          </div>
        )}
      </div>

      {isOpen && <DetailPage modal={() => setIsOpen(false)} post={post} user={user} />}
    </>
  );
}
