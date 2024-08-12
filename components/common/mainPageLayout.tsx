'use client';

import { cn } from '@/lib/utils';

import SideBar from './_sidebar/sidebar';
import { useSidebarToggle } from '@/store/sidebarStore';

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarToggle((state) => state.isOpen);

  return (
    <>
      <SideBar />
      <main
        className={cn(
          'min-h-[100vh] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-60'
        )}>
        {children}
      </main>
    </>
  );
}
