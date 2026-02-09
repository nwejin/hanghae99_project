'use client';

import Link from 'next/link';
import Image from 'next/image';
import text_logo from '@/public/text_logo.png';
import { useEffect, useState } from 'react';

export default function Header() {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      try {
        const parsed = JSON.parse(userDataString);
        setProfileImg(parsed.profileImg || null);
        setNickname(parsed.nickName || null);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('세션 데이터 파싱 오류:', error);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
      <Link href="/">
        <Image src={text_logo} alt="멍냥터 로고" width={120} height={30} />
      </Link>

      {isLoggedIn ? (
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
          {profileImg ? (
            <img src={profileImg} alt="프로필" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              {nickname?.charAt(0) || '?'}
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="text-sm font-medium text-primary">
          로그인
        </Link>
      )}
    </header>
  );
}
