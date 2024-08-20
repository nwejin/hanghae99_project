import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@ui';
import { Label } from '@ui';

import Image from 'next/image';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { BadgePlus } from 'lucide-react';

import CarouselItems from './carouselItems';
import { useFormContext } from 'react-hook-form';

import CarouselBtn from './carouselBtn';

export default function ImgCarousel() {
  // const checkImg = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.files);
  // };

  // const [imgPreview, setImgPreview] = useState<File | null>(null);
  // const [imgUrl, setImgUrl] = useState('');

  // const prevImg = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files === null) return;
  //   const file = e.target.files[0];
  //   setImgUrl(URL.createObjectURL(file));
  //   setImgPreview(file);
  // };

  const { setValue, watch } = useFormContext();
  const imgUrls = watch('imgUrls');

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);

  const checkImg = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const urls = filesArray.map((file) => URL.createObjectURL(file));

      if (index !== undefined) {
        const updatedPreviews = [...imgPreviews];
        updatedPreviews[index] = urls[0];
        setImgPreviews(updatedPreviews);
        setValue('imgUrls', updatedPreviews);
      } else if (imgPreviews.length < 5) {
        const updatedPreviews = [...imgPreviews, ...urls];
        setImgPreviews(updatedPreviews);
        setValue('imgUrls', updatedPreviews);
      } else {
        alert('이미지는 최대 5개까지만 등록할 수 있습니다.');
      }
    }
  };

  return (
    <>
      <Carousel className="ml-12 w-full max-w-sm">
        <CarouselContent>
          {imgPreviews.length === 0 ? (
            <CarouselItem key="placeholder">
              <div className="p-1">
                <Card.Card className="felx items-center justify-center">
                  <Card.CardContent className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-gray-300 p-1">
                    <Label htmlFor="addFile" className="cursor-pointer">
                      <BadgePlus color="gray" />
                    </Label>
                    <input type="file" multiple onChange={checkImg} className="hidden" id="addFile" />
                  </Card.CardContent>
                </Card.Card>
              </div>
            </CarouselItem>
          ) : (
            imgPreviews.map((imgUrl, index) => (
              <CarouselItem key={index}>
                <div className="group relative p-1">
                  <Card.Card>
                    <Card.CardContent className="relative flex aspect-square items-center justify-center p-1">
                      <Image
                        src={imgUrl}
                        alt={`Image ${index}`}
                        objectFit="cover"
                        className="left-0 top-0 h-full w-full rounded-sm object-cover"
                        width={400}
                        height={225}
                      />
                      {/* 새로고침  */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black bg-opacity-30 opacity-0 transition-opacity group-hover:opacity-100">
                        <label
                          htmlFor={`refreshFile-${index}`}
                          className="flex cursor-pointer flex-col items-center text-white">
                          <RefreshCcw size={24} />
                        </label>
                        <input
                          type="file"
                          onChange={(e) => checkImg(e, index)}
                          className="hidden"
                          id={`refreshFile-${index}`}
                        />
                      </div>
                    </Card.CardContent>
                  </Card.Card>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        {imgPreviews.length === 0 ? '' : <CarouselBtn />}
      </Carousel>
    </>
  );
}
