'use client';

import { useRef, useState, useEffect } from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import { ChevronDown } from 'lucide-react';

export function MainPageLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowIndicator(el.scrollTop < 10);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col bg-white shadow-xl max-sm:max-w-full max-sm:shadow-none">
        <Header />
        <div className="relative flex-1 overflow-hidden">
          <main ref={mainRef} className="scrollbar-hide h-full overflow-y-auto">
            {children}
          </main>
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 flex h-16 items-end justify-center bg-gradient-to-t from-white to-transparent pb-1 transition-opacity duration-500 ${
              showIndicator ? 'opacity-100' : 'opacity-0'
            }`}>
            <ChevronDown size={24} className="animate-bounce text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
