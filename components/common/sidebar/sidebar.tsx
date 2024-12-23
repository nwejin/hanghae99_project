import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import box_logo from '@/public/box_logo.png';
import text_logo from '@/public/text_logo.png';

import { Button } from '@/components/common';
import { useSidebarToggle } from '@/store/sidebarStore';
import { SidebarToggle } from './sidebarToggle';
import { Menu } from './menu';

import { useState } from 'react';

import Navbar from './navbar';
import SearchBar from './searchBar';

export default function SideBar() {
  const isOpen = useSidebarToggle((state) => state.isOpen);
  const setIsOpen = useSidebarToggle((state) => state.setIsOpen);

  const isSearchOpen = useSidebarToggle((state) => state.isSearchOpen); // 검색창 상태 가져오기
  const setIsSearchOpen = useSidebarToggle((state) => state.setIsSearchOpen);

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
          isOpen == false ? 'w-[90px]' : 'w-60'
        )}>
        {!isSearchOpen && <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />}
        <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
          <Button
            className={cn(
              'mb-1 flex h-[5rem] items-center transition-transform duration-300 ease-in-out',
              isOpen === false ? 'translate-x-1' : 'translate-x-0'
            )}
            onClick={() => {
              setIsSearchOpen(false);
            }}
            variant="link"
            asChild>
            <Link href="/" className="flex items-center gap-2">
              {isOpen == false ? (
                <Image src={box_logo} alt="Icon" width={24} height={24} className="mr-1 h-7 w-7" />
              ) : (
                ''
              )}
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
      {isSearchOpen && <SearchBar setIsSearchOpen={setIsSearchOpen} />} {/* 검색창 컴포넌트 */}
      <Navbar />
    </>
  );
}
