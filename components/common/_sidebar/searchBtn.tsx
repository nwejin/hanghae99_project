import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserSearch } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useSidebarToggle } from '@/store/sidebarStore';
import { useState } from 'react';

interface MenuProps {
  isOpen: boolean | undefined;
}

export default function SearchBtn({ isOpen }: MenuProps) {
  const { toast } = useToast();
  const setIsOpen = useSidebarToggle((state) => state.setIsOpen);
  const setIsSearchOpen = useSidebarToggle((state) => state.setIsSearchOpen);

  const btnClick = () => {
    const auth = sessionStorage.getItem('user');
    if (!auth) {
      // setAlertOpen(true);
      toast({
        title: '로그인이 필요합니다.',
        action: (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        ),
      });
    } else {
      setIsOpen();
      setIsSearchOpen();
    }
  };
  return (
    <li className="w-full pt-5">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-full justify-start"
              onClick={() => {
                btnClick();
              }}>
              <span className={cn(isOpen === false ? '' : 'mr-4')}>
                <UserSearch size={18} />
              </span>
              <p
                className={cn(
                  'max-w-[200px] truncate',
                  isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
                )}>
                검색
              </p>
            </Button>
          </TooltipTrigger>
          {isOpen === false && <TooltipContent side="right">검색 </TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
