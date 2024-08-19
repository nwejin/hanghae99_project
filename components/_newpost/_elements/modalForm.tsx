import { Card } from '@ui';
import { Input } from '@ui';
import { Button } from '@ui';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/store/modalStore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BadgePlus } from 'lucide-react';
import Image from 'next/image';
import testImg from '@/public/logo.png';
import { useState } from 'react';

import { Switch } from '@/components/ui/switch';

export default function ModalForm() {
  const [imgPreview, setImgPreview] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');

  const prevImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImgUrl(URL.createObjectURL(file));
    setImgPreview(file);
  };

  return (
    <>
      <Card.Card className="relative z-10 h-[35rem] w-[50rem] items-center justify-center rounded-lg bg-white p-0 shadow-md">
        <Card.CardHeader className="flex items-center p-3 pb-6">
          <span className="text-lg font-bold">새 게시물</span>
        </Card.CardHeader>
        <Card.CardContent className="justify-betweenp-4 flex h-4/5 pt-6">
          <div className="flex h-full w-4/5 items-center justify-center">
            <Carousel className="w-4/5">
              <CarouselContent className="">
                <CarouselItem className="">
                  <div className="">
                    <Card.Card>
                      <Card.CardContent className="flex aspect-square items-center justify-center p-6">
                        {imgPreview ? (
                          <Image
                            src={imgUrl}
                            alt="업로드된 이미지"
                            layout="fill"
                            objectFit="cover"
                            className="left-0 top-0 h-full w-full object-cover"
                          />
                        ) : (
                          ''
                        )}
                        <label htmlFor="">
                          <BadgePlus color="grey" />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={prevImg}
                          className="absolute cursor-pointer opacity-0"
                        />
                      </Card.CardContent>
                    </Card.Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div>
                    <Card.Card>
                      <Card.CardContent className="flex aspect-square items-center justify-center p-6">
                        {imgPreview ? (
                          <Image
                            src={imgUrl}
                            alt="업로드된 이미지"
                            layout="fill"
                            objectFit="cover"
                            className="absolute left-0 top-0 h-full w-full object-cover"
                          />
                        ) : (
                          ''
                        )}
                        <label htmlFor="">
                          <BadgePlus />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={prevImg}
                          className="absolute cursor-pointer opacity-0"
                        />
                      </Card.CardContent>
                    </Card.Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div>
                    <Card.Card>
                      <Card.CardContent className="flex aspect-square items-center justify-center p-6">
                        {imgPreview ? (
                          <Image
                            src={imgUrl}
                            alt="업로드된 이미지"
                            layout="fill"
                            objectFit="cover"
                            className="absolute left-0 top-0 h-full w-full object-cover"
                          />
                        ) : (
                          ''
                        )}
                        <label htmlFor="">
                          <BadgePlus />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={prevImg}
                          className="absolute cursor-pointer opacity-0"
                        />
                      </Card.CardContent>
                    </Card.Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform" />
              <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform" />
            </Carousel>
          </div>
          <div className="w-2/5 flex-row">
            <Textarea placeholder="내용을 입력하세요" rows={5} className="h-3/5 w-full" />
            <div className="mt-3 flex items-center">
              <Switch />
              <p className="ml-3">공개</p>
            </div>
            <div className="mt-20 flex items-center justify-end">
              <Button>작성하기</Button>
            </div>
          </div>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
