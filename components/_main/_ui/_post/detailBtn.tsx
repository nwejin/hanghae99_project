import { Button } from '@/components/ui/button';

interface openProps {
  modal: () => void;
}

export default function DetailBtn({ modal }: openProps) {
  return (
    <>
      <div className="flex justify-end">
        <Button variant="link" className="p-0 text-xs" onClick={modal}>
          자세히 보기
        </Button>
      </div>
    </>
  );
}
