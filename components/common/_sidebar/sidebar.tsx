'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PanelsTopLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/public/logo.png';
import text_logo from '@/public/text_logo.png';

import { Button } from '@ui';
import { useSidebarToggle } from '@/store/sidebarStore';
import { SidebarToggle } from './sidebarToggle';
import { Menu } from './menu';

export default function SideBar() {
  const isOpen = useSidebarToggle((state) => state.isOpen);
  const setIsOpen = useSidebarToggle((state) => state.setIsOpen);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        isOpen == false ? 'w-[90px]' : 'w-60'
      )}>
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            'mb-1 flex items-center transition-transform duration-300 ease-in-out',
            isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild>
          <Link href="/" className="flex items-center gap-2">
            {isOpen == false ? <Image src={logo} alt="Icon" width={24} height={24} className="mr-1 h-7 w-7" /> : ''}
            <Image
              src={text_logo}
              alt="멍냥터 로고"
              width={150}
              // height={30}
              className={cn(
                'whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-in-out',
                isOpen === false ? 'hidden -translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
              )}
            />
          </Link>
        </Button>
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
}
