import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';

export default function NavBarNewPostBtn() {
  const { modal, openModal, closeModal } = useModalStore();

  return (
    <>
      <Button
        variant="ghost"
        className="flex flex-col items-center space-y-1"
        onClick={() => {
          openModal();
          console.log(modal);
        }}>
        <SquarePen size={36} />
      </Button>
    </>
  );
}
