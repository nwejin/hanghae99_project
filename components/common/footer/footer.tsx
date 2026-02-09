'use client';

import Link from 'next/link';
import { Home, SquarePen, User } from 'lucide-react';
import { Button } from '@/components/common';
import { usePathname } from 'next/navigation';
import { useModalStore } from '@/store/modalStore';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/common/ui/use-toast';

export default function Footer() {
  const pathname = usePathname();
  const { openModal } = useModalStore();
  const { toast } = useToast();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      try {
        const parsed = JSON.parse(userDataString);
        setNickname(parsed.nickName || null);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleNewPost = () => {
    if (!isLoggedIn) {
      toast({
        title: '로그인이 필요합니다.',
        action: (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        ),
      });
      return;
    }
    openModal();
  };

  return (
    <footer className="sticky bottom-0 z-20 flex h-[60px] items-center justify-around border-t bg-white py-2 dark:border-zinc-800 dark:bg-zinc-900">
      <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="icon" asChild>
        <Link href="/">
          <Home size={24} />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleNewPost}>
        <SquarePen size={24} />
      </Button>
      <Button variant={pathname.includes('/user') ? 'secondary' : 'ghost'} size="icon" asChild>
        <Link href={isLoggedIn ? `/user/${nickname}` : '/login'}>
          <User size={24} />
        </Link>
      </Button>
    </footer>
  );
}
