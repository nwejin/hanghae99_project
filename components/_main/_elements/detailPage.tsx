import { X } from 'lucide-react';
import { Card } from '@ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useEffect, useState } from 'react';

import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CarouselBtn from '../_ui/_post/carouselBtn';

import { Post, User } from '@/lib/getAllPost';

interface detailProps {
  post: Post;
  user: User;
  modal: () => void;
}

export default function DetailPage({ modal, post, user }: detailProps) {
  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    console.log(post, user);
  };

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
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={modal} />
        <button onClick={modal} className="absolute right-10 top-10">
          <X color="#ffffff" strokeWidth={3} />
        </button>
        <Card.Card className="relative z-10 flex h-[44rem] w-[70rem] items-center justify-center rounded-lg bg-white p-0 shadow-md">
          <Card.CardContent className="flex h-full w-full pb-6 pt-6">
            {/* <img
              src="https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724215301226_e608213f-0bd3-44e0-b8e8-8943c3459b21?alt=media&token=404e3f34-4707-47e4-9831-2ca726bd103e"
              width={650}
              height={650}
              alt="Pet Image"
              className="aspect-square object-cover"
            /> */}
            <div className="relative max-w-2xl">
              <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                  {post.imgUrls.map((img, index) => (
                    <CarouselItem key={index}>
                      <img src={img} width={650} height={650} alt="Pet Image" className="aspect-square object-cover" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {post.imgUrls.length === 0 ? '' : <CarouselBtn />}
              </Carousel>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-gray-400 bg-opacity-70 p-1 px-3 text-center text-xs text-white">
                {current} / {count}
              </div>
            </div>
            <div className="h-full w-full">
              <Card.Card className="rounded-none p-3">
                <Card.CardContent className="p-0">
                  <Link
                    href={`/user/${user.nickname}`}
                    className="flex items-center gap-2 text-sm font-semibold"
                    prefetch={false}>
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user.profile_image} alt={user.nickname} />
                      <AvatarFallback>{user.nickname}</AvatarFallback>
                    </Avatar>
                    {user.nickname}
                  </Link>
                </Card.CardContent>
              </Card.Card>
              <ScrollArea className="h-3/5 w-full rounded-none border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none"> {post.contents}</h4>
                  <Separator className="my-3" />
                  {tags.map((tag, index) => (
                    <div key={index}>
                      <div className="text-sm">{tag}</div>
                      <Separator className="my-3" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex w-full items-center">
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Like</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Comment</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  className="h-full rounded-none"
                  value={inputValue}
                  onChange={handleChange}
                />
                {inputValue && <Button className="absolute bottom-4 right-2">등록</Button>}
              </div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </div>
    </>
  );
}
