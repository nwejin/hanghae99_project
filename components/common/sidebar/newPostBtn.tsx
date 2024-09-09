'use client';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/common';
import { Button } from '@/components/common';
import { SquarePen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { useEffect, useState } from 'react';
import NewPostAlert from './newPostAlert';
import Link from 'next/link';
import { useToast } from '@/components/common/ui/use-toast';

interface MenuProps {
  isOpen: boolean | undefined;
}

export default function NewPostBtn({ isOpen }: MenuProps) {
  const { modal, openModal, closeModal } = useModalStore();
  const [alertOpen, setAlertOpen] = useState(false);
  // console.log(modal);
  const { toast } = useToast();

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
      openModal();
    }
  };

  return (
    <>
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
                  <SquarePen size={18} />
                </span>
                <p
                  className={cn(
                    'max-w-[200px] truncate',
                    isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
                  )}>
                  새 게시글
                </p>
              </Button>
            </TooltipTrigger>
            {isOpen === false && <TooltipContent side="right">새 게시글 </TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </li>
      <NewPostAlert open={alertOpen} onOpenChange={setAlertOpen} />
    </>
  );
}
