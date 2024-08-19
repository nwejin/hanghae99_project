'use client';

import Link from 'next/link';
import { Ellipsis, LogOut, LogIn, SquarePen } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { getMenuList } from '@/lib/menu-list';
import { SignBtn } from './signBtn';
import NewPostBtn from './newPostBtn';
import { useEffect, useState } from 'react';

// 로그인 정보 불러오기
import { userStore } from '@/store/userStore';
import { getUserNickname } from '@/lib/getNickName';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  // const menuList = getMenuList(pathname);

  const user = userStore((state) => state.user);
  // console.log('user', user);

  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    // 세션에서 사용자 데이터 가져오기
    const sessionData = sessionStorage.getItem('auth');

    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        setNickname(userData.nickname || null);
      } catch (error) {
        console.error('세션 데이터 파싱 중 오류 발생:', error);
      }
    }
  }, []);

  const menuList = getMenuList(pathname, { nickname });

  return (
    <>
      <ScrollArea className="[&>div>div[style]]:!block">
        <nav className="mt-8 h-full w-full">
          <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
            <NewPostBtn isOpen={isOpen} />

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
                            <Link href={href}>
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
      </ScrollArea>
    </>
  );
}
