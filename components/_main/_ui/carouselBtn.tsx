import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
export default function CarouselBtn() {
  return (
    <>
      <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform border-none" />
      <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform border-none" />
    </>
  );
}
