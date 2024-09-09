import { Button } from '@/components/common';
import { timeCheck } from '@/shared/timeUtils';
interface openProps {
  modal: () => void;
  time: string;
}

export default function DetailBtn({ modal, time }: openProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-300">{timeCheck(time)}</p>
        <Button variant="link" className="p-0 text-xs" onClick={modal}>
          자세히 보기
        </Button>
      </div>
    </>
  );
}
