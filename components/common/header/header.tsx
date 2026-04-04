'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import text_logo from '@/public/image/logo_s.png';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  onLogoClick: () => void;
}

export default function Header({ onLogoClick }: Props) {
  const { nickname, profileImg, isLoggedIn, role } = useCurrentUser();
  const logoRef = useRef<HTMLImageElement>(null);
  const idleAnim = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    idleAnim.current = gsap.to(logoRef.current, {
      scale: 1.07,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      idleAnim.current?.kill();
    };
  }, []);

  const handleLogoClick = () => {
    gsap.timeline()
      .to(logoRef.current, { scale: 1.25, duration: 0.12, ease: 'power2.out' })
      .to(logoRef.current, { scale: 0.92, duration: 0.1 })
      .to(logoRef.current, { scale: 1.07, duration: 0.18, ease: 'back.out(2)' });
    onLogoClick();
  };

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b-2 border-paw-cream bg-paw-cream-dark px-4">
      <button onClick={handleLogoClick} className="origin-left">
        <Image ref={logoRef} src={text_logo} alt="cheonggun_logo" width={120} />
      </button>

      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <Link
              href="/admin"
              className="btn-app flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-paw-cream">
              <Settings size={20} strokeWidth={2} />
            </Link>
          )}
          <Link href={`/user/${nickname}`} className="btn-app h-8 w-8 overflow-hidden rounded-full bg-paw-cream">
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
