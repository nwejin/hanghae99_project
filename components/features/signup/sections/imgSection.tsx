'use client';

import { Card } from '@/components/common';
import { cat_img, dog_img } from '@/public';
import Image from 'next/image';

export default function ImgSection() {
  return (
    <>
      <Card.CardContent className="flex items-end justify-center gap-y-2 p-0">
        <Image src={dog_img} alt="dog" width={130} className="mr-1" />
        <Image src={cat_img} alt="cat" width={130} className="mr-1" />
      </Card.CardContent>
    </>
  );
}
