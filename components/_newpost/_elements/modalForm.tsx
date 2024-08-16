import { Card } from '@ui';
import { Input } from '@ui';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/store/modalStore';

export default function ModalForm() {
  const { closeModal } = useModalStore();
  return (
    <>
      <Card.Card className="relative z-10 h-[35rem] w-[50rem] items-center justify-center rounded-lg bg-white p-8 shadow-md">
        <Card.CardContent>
          <div>img</div>
          <Input />
          <Textarea />
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
