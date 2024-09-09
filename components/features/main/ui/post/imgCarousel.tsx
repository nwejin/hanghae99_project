'use client';

import { type CarouselApi } from '@/components/common/ui/carousel';
import { Carousel } from '@/components/common';
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
      <Carousel.Carousel className="max-w-xl" setApi={setApi}>
        <Carousel.CarouselContent>
          {imgUrls.map((img, index) => (
            <Carousel.CarouselItem key={index}>
              <img src={img} width={600} height={600} alt="Pet Image" className="aspect-square object-cover" />
            </Carousel.CarouselItem>
          ))}
        </Carousel.CarouselContent>
        {imgUrls.length === 0 ? '' : <CarouselBtn />}
      </Carousel.Carousel>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-gray-400 bg-opacity-70 p-1 px-3 text-center text-xs text-white">
        {current} / {count}
      </div>
    </>
  );
}
