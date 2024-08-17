import { Card } from '@ui';
import { Input } from '@ui';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/store/modalStore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function ModalForm() {
  const { closeModal } = useModalStore();
  return (
    <>
      <Card.Card className="relative z-10 h-[35rem] w-[50rem] items-center justify-center rounded-lg bg-white p-8 shadow-md">
        <Card.CardContent className="flex h-full bg-slate-400">
          <div className="flex h-full w-3/5 items-center justify-center">
            <Carousel className="h-full w-full bg-slate-800">
              <CarouselContent>
                <CarouselItem>
                  <div className="flex h-1/2 w-1/2 items-center justify-center bg-gray-300">
                    <span>img</span>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex h-1/2 w-1/2 items-center justify-center bg-gray-300">
                    <span>img</span>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex h-1/2 w-1/2 items-center justify-center bg-gray-300">
                    <span>img</span>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            {/* <label htmlFor="">이미지</label> */}
            <Input type="file" className="hidden" />
          </div>
          <div className="w-2/5 p-4">
            <Textarea placeholder="내용을 입력하세요" rows={5} className="h-full w-full" />
          </div>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
