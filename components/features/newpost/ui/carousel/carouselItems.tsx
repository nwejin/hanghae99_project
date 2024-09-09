'use client';

import { Carousel } from '@/components/common';

import { Card } from '@/components/common';

import Image from 'next/image';
import { useState } from 'react';

import { BadgePlus } from 'lucide-react';

interface CarouselItemsProps {
  imgUrl: string;
}

export default function CarouselItems({ imgUrl }: CarouselItemsProps) {
  console.log(imgUrl);
  return (
    <Carousel.CarouselItem>
      <Card.Card>
        <Card.CardContent className="flex aspect-square items-center justify-center overflow-hidden p-6">
          <Image
            src={imgUrl}
            alt="Uploaded Image"
            layout="fill"
            objectFit="cover"
            className="left-0 top-0 h-full w-full object-cover"
          />
        </Card.CardContent>
      </Card.Card>
    </Carousel.CarouselItem>
  );
}
