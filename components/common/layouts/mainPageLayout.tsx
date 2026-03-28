'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MainPageLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Pull-to-refresh
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const THRESHOLD = 80;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const el = mainRef.current;
    if (!el || el.scrollTop > 0) return;
    touchStartY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || refreshing) return;
    const el = mainRef.current;
    if (!el || el.scrollTop > 0) {
      isPulling.current = false;
      setPullDistance(0);
      return;
    }

    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff * 0.4, 120));
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      router.refresh();
      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, refreshing, router]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="h-dvh bg-paw-olive">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col bg-white shadow-xl max-sm:max-w-full max-sm:shadow-none">
        <Header />
        <div className="relative flex-1 overflow-hidden">
          {/* Pull-to-refresh 인디케이터 */}
          <div
            className="flex items-center justify-center transition-[height] duration-200"
            style={{ height: pullDistance }}
          >
            {pullDistance > 0 && (
              <Loader2
                size={20}
                className={`text-paw-main ${refreshing ? 'animate-spin' : ''}`}
                style={{
                  opacity: Math.min(pullDistance / THRESHOLD, 1),
                  transform: `rotate(${pullDistance * 3}deg)`,
                }}
              />
            )}
          </div>

          <main
            ref={mainRef}
            className="scrollbar-hide h-full overflow-y-auto"
            style={{ height: `calc(100% - ${pullDistance}px)` }}
          >
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
