'use client';

import Link from 'next/link';
import Image from 'next/image';
import text_logo from '@/public/logo_s.png';
import { useCurrentUser } from '@/lib/useCurrentUser';

export default function Header() {
  const { nickname, profileImg, isLoggedIn } = useCurrentUser();

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b-2 border-paw-cream bg-paw-cream-dark px-4">
      <Link href="/">
        <Image src={text_logo} alt="멍냥터 로고" width={120} />
      </Link>

      {isLoggedIn ? (
        <Link
          href={`/user/${nickname}`}
          className="h-8 w-8 overflow-hidden rounded-full border-2 border-paw-tag bg-paw-main">
          {profileImg ? (
            <img src={profileImg} alt="프로필" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paw-sub">
              {nickname?.charAt(0) || '?'}
            </div>
          )}
        </Link>
      ) : (
        <Link href="/login" className="text-sm font-semibold text-paw-main">
          로그인
        </Link>
      )}
    </header>
  );
}
