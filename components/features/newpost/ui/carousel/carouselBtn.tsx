import { Carousel } from '@/components/common';
export default function CarouselBtn() {
  return (
    <>
      <Carousel.CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform border-none" />
      <Carousel.CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform border-none" />
    </>
  );
}
