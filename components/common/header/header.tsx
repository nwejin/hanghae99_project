'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import text_logo from '@/public/logo_s.png';
import { useCurrentUser } from '@/lib/useCurrentUser';

export default function Header() {
  const { nickname, profileImg, isLoggedIn, role } = useCurrentUser();

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b-2 border-paw-cream bg-paw-cream-dark px-4">
      <Link href="/">
        <Image src={text_logo} alt="멍냥터 로고" width={120} />
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <Link
              href="/admin"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paw-tag bg-paw-main text-paw-cream">
              <Settings size={20} strokeWidth={2} />
            </Link>
          )}
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
        </div>
      ) : (
        <Link href="/login" className="text-sm font-semibold text-paw-main">
          로그인
        </Link>
      )}
    </header>
  );
}
