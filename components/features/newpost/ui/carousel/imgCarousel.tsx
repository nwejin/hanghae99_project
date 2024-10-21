'use client';

import { Carousel } from '@/components/common';
import { Card } from '@/components/common';
import { Label } from '@/components/common';

import Image from 'next/image';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { BadgePlus } from 'lucide-react';

import CarouselItems from './carouselItems';
import { useFormContext } from 'react-hook-form';

import CarouselBtn from './carouselBtn';
import { convertToWebP } from '@/shared';

export default function ImgCarousel() {
  const { setValue } = useFormContext();

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);

  const MAX_IMAGES = 5;

  const checkImg = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files) {
      // const filesArray = Array.from(e.target.files);
      // const urls = filesArray.map((file) => URL.createObjectURL(file));

      const filesArray = Array.from(e.target.files);
      const urls: string[] = [];

      for (const file of filesArray) {
        try {
          const webpBlob = await convertToWebP(file); // 이미지를 WebP로 변환
          if (webpBlob) {
            const webpUrl = URL.createObjectURL(webpBlob);
            urls.push(webpUrl);
          }
        } catch (error) {
          console.error('이미지 변환 에러:', error);
          return;
        }
      }

      if (index !== undefined) {
        // 기존 이미지를 업데이트
        const updatedPreviews = [...imgPreviews];
        updatedPreviews[index] = urls[0];

        setImgPreviews(updatedPreviews);
        setValue('imgUrls', updatedPreviews);
      } else {
        // 새 이미지를 추가
        if (imgPreviews.length + urls.length <= MAX_IMAGES) {
          const updatedPreviews = [...imgPreviews, ...urls];
          setImgPreviews(updatedPreviews);
          setValue('imgUrls', updatedPreviews);
        } else {
          alert(`이미지는 최대 ${MAX_IMAGES}개까지만 등록할 수 있습니다.`);
        }
      }
    }
  };

  return (
    <>
      <Carousel.Carousel className="ml-12 w-full max-w-sm">
        <Carousel.CarouselContent>
          {imgPreviews.length === 0 ? (
            <Carousel.CarouselItem key="placeholder">
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
            </Carousel.CarouselItem>
          ) : (
            imgPreviews.map((imgUrl, index) => (
              <Carousel.CarouselItem key={index}>
                <div className="group relative p-1">
                  <Card.Card>
                    <Card.CardContent className="relative flex aspect-square items-center justify-center p-1">
                      <Image
                        src={imgUrl}
                        alt={`Image ${index}`}
                        objectFit="cover"
                        className="left-0 top-0 h-full w-full rounded-sm object-cover"
                        width={512}
                        height={512}
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
              </Carousel.CarouselItem>
            ))
          )}
        </Carousel.CarouselContent>
        {imgPreviews.length === 0 ? '' : <CarouselBtn />}
      </Carousel.Carousel>
    </>
  );
}
