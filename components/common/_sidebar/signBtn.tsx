import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

import { LogOut, LogIn } from 'lucide-react';
import { auth } from '@/config/firebase';

// 로그인 정보 불러오기
import { userStore } from '@/store/userStore';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function SignBtn({ isOpen }: MenuProps) {
  const user = userStore((state) => state.user);
  console.log('user', typeof user);
  return (
    <>
      <li className="flex w-full grow">
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              {user ? (
                <Button onClick={() => auth.signOut()} variant="outline" className="mt-5 h-10 w-full justify-center">
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
