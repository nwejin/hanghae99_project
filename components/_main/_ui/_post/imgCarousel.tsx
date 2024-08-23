import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CarouselBtn from './carouselBtn';
import { useEffect, useState } from 'react';

interface imgProps {
  imgUrls: string[];
}

export default function ImgCarousel({ imgUrls }: imgProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel className="max-w-xl" setApi={setApi}>
        <CarouselContent>
          {imgUrls.map((img, index) => (
            <CarouselItem key={index}>
              <img src={img} width={600} height={600} alt="Pet Image" className="aspect-square object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        {imgUrls.length === 0 ? '' : <CarouselBtn />}
      </Carousel>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-gray-400 bg-opacity-70 p-1 px-3 text-center text-xs text-white">
        {current} / {count}
      </div>
    </>
  );
}
