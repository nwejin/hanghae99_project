'use client';

import Link from 'next/link';
import { Ellipsis, LogOut, LogIn, SquarePen } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/common';
import { ScrollArea } from '@/components/common';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/common';
import { getMenuList } from '@/shared/menu-list';
import { SignBtn } from './signBtn';
import NewPostBtn from './newPostBtn';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/common';
import { ToastAction } from '@/components/common/ui/toast';
import SearchBtn from './searchBtn';
import { useSidebarToggle } from '@/store/sidebarStore';

// 로그인 정보 불러오기
import { getUserNickname } from '@/lib/userAuth';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const setIsSearchOpen = useSidebarToggle((state) => state.setIsSearchOpen);
  const pathname = usePathname();
  // const menuList = getMenuList(pathname);

  // const nickname = userStore((state) => state.nickName);

  // console.log('user', user);

  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // 세션에서 사용자 데이터 가져오기
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setNickname(parsedUserData.nickName);
        setIsLoggedIn(!!userDataString);

        // console.log(nickname);

        // console.log(userData.nickname);
      } catch (error) {
        console.error('세션 데이터 파싱 중 오류 발생:', error);
      }
    } else {
      setIsLoggedIn(false);
    }
    // console.log(sessionData);
  }, []);

  const { toast } = useToast();

  const menuClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isLoggedIn) {
      e.preventDefault(); // 링크 기본 동작 방지
      toast({
        title: '로그인이 필요합니다.',
        action: (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        ),
      });
    } else {
      setIsSearchOpen(false);
    }
  };

  const menuList = getMenuList(pathname, { nickname });

  return (
    <>
      <nav className="mt-8 h-full w-full overflow-hidden">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          <NewPostBtn isOpen={isOpen} />
          <SearchBtn isOpen={isOpen} />

          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span></span>
              )}
              {menus.map(({ href, label, icon: Icon, active }, index) => (
                <div className="w-full" key={index}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? 'secondary' : 'ghost'}
                          className="mb-1 h-10 w-full justify-start"
                          asChild>
                          {/* */}
                          <Link href={href} onClick={(e) => menuClick(e, href)}>
                            <span className={cn(isOpen === false ? '' : 'mr-4')}>
                              <Icon size={18} />
                            </span>
                            <p
                              className={cn(
                                'max-w-[200px] truncate',
                                isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
                              )}>
                              {label}
                            </p>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </li>
          ))}

          <SignBtn isOpen={isOpen} />
        </ul>
      </nav>
    </>
  );
}
