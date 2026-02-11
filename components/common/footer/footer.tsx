'use client';

import { Home, Search, SquarePen, User, LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { useToast } from '@/components/common/ui/use-toast';
import { Button } from '@/components/common';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { openModal } = useModalStore();
  const { toast } = useToast();

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    setIsLoggedIn(!!userDataString);
  }, []);

  const handleNewPost = () => {
    const auth = sessionStorage.getItem('user');
    if (!auth) {
      toast({
        title: '로그인이 필요합니다.',
        action: (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        ),
      });
    } else {
      openModal();
    }
  };

  const tabs = [
    { icon: Home, label: '홈', active: pathname === '/' },
    { icon: Search, label: '검색', active: pathname === '/search' },
    { icon: SquarePen, label: '글 작성', active: false, onClick: handleNewPost },
    { icon: User, label: '프로필', active: pathname.includes('/user') },
    {
      icon: isLoggedIn ? LogOut : LogIn,
      label: isLoggedIn ? '로그아웃' : '로그인',
      active: pathname === '/login',
    },
  ];

  return (
    <footer className="sticky bottom-0 z-20 flex h-[60px] bg-white dark:bg-zinc-900">
      {tabs.map(({ icon: Icon, label, active, onClick }, index) => (
        <button
          key={label}
          onClick={onClick}
          className={cn(
            'flex h-full w-full flex-col items-center justify-center border-t border-gray-200 shadow-[inset_0_2px_3px_0_rgba(0,0,0,0.06)] transition-all duration-200 dark:border-zinc-700',
            index < tabs.length - 1 && 'border-r',
            active
              ? 'bg-primary text-white shadow-[inset_0_2px_3px_0_rgba(0,0,0,0.15)]'
              : 'text-gray-400 opacity-60 hover:opacity-100'
          )}>
          <div
            className={cn(
              'transition-transform duration-200',
              active && '-translate-y-1.5',
              active ? 'text-white' : ''
            )}>
            <Icon size={22} />
          </div>
          <span
            className={cn(
              'text-[10px] font-bold transition-all duration-200',
              active ? '-translate-y-1.5 opacity-100' : 'hidden'
            )}>
            {label}
          </span>
        </button>
      ))}
    </footer>
  );
}
