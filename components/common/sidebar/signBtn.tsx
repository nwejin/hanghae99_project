'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/common';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/common';

import { LogOut, LogIn } from 'lucide-react';
import { auth } from '@/config/firebase';
import { useToast } from '@/components/common/ui/use-toast';
import { userAuth } from '@/lib/userAuth';
import { useEffect, useState } from 'react';
// 로그인 정보 불러오기

import { userLogOut } from '@/lib/login';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function SignBtn({ isOpen }: MenuProps) {
  // const user = userStore((state) => state.userId);
  const { toast } = useToast();

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = sessionStorage.getItem('user');
    setIsAuth(!!checkAuth);
  }, []);

  const signOut = () => {
    userLogOut();
    setIsAuth(false);

    toast({
      title: '로그아웃이 완료되었습니다.',
    });

    // window.location.reload();
  };

  return (
    <>
      <li className="flex w-full grow">
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              {isAuth ? (
                <Button onClick={signOut} variant="outline" className="mt-5 h-10 w-full justify-center">
                  <div className="flex w-full justify-center">
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>
                      <LogOut size={18} />
                    </span>
                    <p className={cn('whitespace-nowrap', isOpen === false ? 'hidden opacity-0' : 'opacity-100')}>
                      로그아웃
                    </p>
                  </div>
                </Button>
              ) : (
                <Button onClick={() => {}} variant="outline" className="mt-5 h-10 w-full justify-center">
                  <Link href="/login" className="flex w-full justify-center">
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>
                      <LogIn size={18} />
                    </span>
                    <p className={cn('whitespace-nowrap', isOpen === false ? 'hidden opacity-0' : 'opacity-100')}>
                      로그인
                    </p>
                  </Link>
                </Button>
              )}
            </TooltipTrigger>
            {/* {isOpen === false && <TooltipContent side="right">Login</TooltipContent>} */}
          </Tooltip>
        </TooltipProvider>
      </li>
    </>
  );
}
