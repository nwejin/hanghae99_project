import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';

interface MenuProps {
  isOpen: boolean | undefined;
}

export default function NewPostBtn({ isOpen }: MenuProps) {
  const { modal, openModal, closeModal } = useModalStore();
  // console.log(modal);

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
                  openModal();
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
    </>
  );
}
