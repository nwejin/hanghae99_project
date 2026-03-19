'use client';

import { Home, Search, SquarePen, Bell, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/common/ui/use-toast';
import { Button } from '@/components/common';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { getUnreadCount, markAllAsRead } from '@/lib/notification';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { nickname, isLoggedIn } = useCurrentUser();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  // 알림 뱃지: 30초마다 읽지 않은 알림 수 조회
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUnread = () => {
      getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

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
    } else {
      router.push('/newpost');
    }
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      router.push(`/user/${nickname}`);
    } else {
      router.push('/login');
    }
  };

  const handleNotification = async () => {
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
    // 알림 읽음 처리 + 페이지 이동
    await markAllAsRead();
    setUnreadCount(0);
    router.push('/notification');
  };

  const tabs = [
    { icon: Home, label: '홈', active: pathname === '/', href: '/' },
    { icon: Search, label: '검색', active: pathname === '/search', href: '/search' },
    { icon: SquarePen, label: '글작성', active: pathname === '/newpost', onClick: handleNewPost },
    {
      icon: Bell,
      label: '알림',
      active: pathname === '/notification',
      onClick: handleNotification,
      badge: unreadCount,
    },
    {
      icon: User,
      label: '내정보',
      active: pathname.includes('/user') || pathname.includes('/accounts'),
      onClick: handleProfile,
    },
  ];

  return (
    <footer className="sticky bottom-0 z-[99] flex h-[56px] border-t-2 border-paw-cream bg-paw-cream-dark">
      {tabs.map(({ icon: Icon, label, active, href, onClick, badge }) => {
        const content = (
          <div
            className={cn(
              'flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md text-paw-cream transition-all duration-200',
              active ? 'bg-paw-main' : 'text-paw-inactive hover:text-paw-main'
            )}>
            <div className="relative">
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-extrabold">{label}</span>
          </div>
        );

        if (onClick) {
          return (
            <button key={label} onClick={onClick} className="flex-1">
              {content}
            </button>
          );
        }

        return (
          <Link key={label} href={href || '/'} className="flex-1">
            {content}
          </Link>
        );
      })}
    </footer>
  );
}
