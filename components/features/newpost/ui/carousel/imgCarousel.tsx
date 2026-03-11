'use client';

import { Carousel } from '@/components/common';

import Image from 'next/image';
import { useState } from 'react';
import { RefreshCcw, ImagePlus } from 'lucide-react';

import { useFormContext } from 'react-hook-form';

import CarouselBtn from './carouselBtn';
import { convertToWebP } from '@/shared';

export default function ImgCarousel() {
  const { setValue } = useFormContext();

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);

  const MAX_IMAGES = 5;

  const checkImg = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const urls: string[] = [];

      for (const file of filesArray) {
        try {
          const webpBlob = await convertToWebP(file);
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
        const updatedPreviews = [...imgPreviews];
        updatedPreviews[index] = urls[0];
        setImgPreviews(updatedPreviews);
        setValue('imgUrls', updatedPreviews);
      } else {
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
    <div className="rounded-2xl border border-paw-border bg-white p-4">
      <label className="mb-2 block text-xs font-semibold text-paw-sub">
        사진 ({imgPreviews.length}/{MAX_IMAGES})
      </label>
      <Carousel.Carousel className="w-full">
        <Carousel.CarouselContent>
          {imgPreviews.length === 0 ? (
            <Carousel.CarouselItem key="placeholder">
              <label
                htmlFor="addFile"
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-paw-border bg-paw-cream-dark transition-colors hover:border-paw-orange"
              >
                <ImagePlus size={32} className="text-paw-inactive" />
                <span className="text-xs text-paw-sub">사진 추가</span>
              </label>
              <input type="file" multiple onChange={checkImg} className="hidden" id="addFile" accept="image/*" />
            </Carousel.CarouselItem>
          ) : (
            imgPreviews.map((imgUrl, index) => (
              <Carousel.CarouselItem key={index}>
                <div className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={imgUrl}
                      alt={`사진 ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={512}
                      height={512}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <label
                        htmlFor={`refreshFile-${index}`}
                        className="flex cursor-pointer flex-col items-center gap-1 text-white"
                      >
                        <RefreshCcw size={20} />
                        <span className="text-[10px]">변경</span>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => checkImg(e, index)}
                        className="hidden"
                        id={`refreshFile-${index}`}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </Carousel.CarouselItem>
            ))
          )}
        </Carousel.CarouselContent>
        {imgPreviews.length > 0 && <CarouselBtn />}
      </Carousel.Carousel>
      {imgPreviews.length > 0 && imgPreviews.length < MAX_IMAGES && (
        <label
          htmlFor="addMoreFile"
          className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-paw-border py-2 text-xs text-paw-sub transition-colors hover:border-paw-orange hover:text-paw-orange"
        >
          <ImagePlus size={14} />
          사진 추가
        </label>
      )}
      {imgPreviews.length > 0 && imgPreviews.length < MAX_IMAGES && (
        <input type="file" multiple onChange={checkImg} className="hidden" id="addMoreFile" accept="image/*" />
      )}
    </div>
  );
}
