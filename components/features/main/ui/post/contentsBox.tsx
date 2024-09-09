'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/common';

interface contentsProps {
  nickname: string;
  contents: string;
}
export default function ContentsBox({ nickname, contents }: contentsProps) {
  const [isFull, setIsFull] = useState(false);

  const showFullContent = () => {
    setIsFull(!isFull);
  };

  return (
    <>
      <div className="grid w-full gap-1 text-sm">
        <div className={`${isFull ? '' : 'line-clamp-1'} transition-all`}>
          <Link href="#" className="mr-2 font-black" prefetch={false}>
            {nickname}
          </Link>
          {contents}
        </div>
        <div className="flex justify-start">
          <Button variant="link" className="h-fit p-0 text-xs text-gray-400" onClick={showFullContent}>
            {isFull ? '접기' : '더보기'}
          </Button>
        </div>
      </div>
    </>
  );
}
