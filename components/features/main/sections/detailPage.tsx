'use client';

import { X } from 'lucide-react';
import { Card } from '@/components/common';
import { ScrollArea, ScrollBar } from '@/components/common';
import { Separator } from '@/components/common';
import { Textarea } from '@/components/common';
import { Button } from '@/components/common';
import Link from 'next/link';
import { Avatar } from '@/components/common';
import Image from 'next/image';
import { useGetComment, useCreatePost } from '@/lib/comment';

import { useEffect, useState } from 'react';
import Buttons from '../ui/post/buttons';

import { type CarouselApi } from '@/components/common/ui/carousel';
import { Carousel } from '@/components/common';
import CarouselBtn from '../ui/post/carouselBtn';

import { timeCheck } from '@/shared/timeUtils';

import { PostType, UserType } from '@/lib/post';

interface detailProps {
  post: PostType;
  user: UserType;
  modal: () => void;
}

export default function DetailPage({ modal, post, user }: detailProps) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
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

  const { data: comments, refetch } = useGetComment(post.id);
  const createPost = useCreatePost();

  const handleCommentSubmit = async () => {
    if (inputValue.trim() === '') return;

    createPost.mutate(
      { postId: post.id, comment: inputValue },
      {
        onSuccess: () => {
          setInputValue('');
          refetch(); // 댓글 목록 갱신
        },
      }
    );
  };

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserId(parsedUserData.userId);
    }
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={modal} />
        <button onClick={modal} className="absolute right-10 top-10">
          <X color="#ffffff" strokeWidth={3} />
        </button>
        <Card.Card className="relative z-10 flex h-[44rem] w-[70rem] items-center justify-center rounded-lg bg-white p-0 shadow-md">
          <Card.CardContent className="grid h-full w-full grid-cols-7 gap-4 pb-6 pt-6">
            {/* 이미지 */}
            <div className="border-1 relative col-span-4 flex items-center justify-center border">
              <Carousel.Carousel className="" setApi={setApi}>
                <Carousel.CarouselContent>
                  {post.imgUrls.map((img, index) => (
                    <Carousel.CarouselItem key={index}>
                      <Image
                        src={img}
                        width={650}
                        height={650}
                        alt={`Pet Image ${index}`}
                        className="aspect-square object-cover"
                      />
                    </Carousel.CarouselItem>
                  ))}
                </Carousel.CarouselContent>
                {post.imgUrls.length === 0 ? '' : <CarouselBtn />}
              </Carousel.Carousel>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-gray-400 bg-opacity-70 p-1 px-3 text-center text-xs text-white">
                {current} / {count}
              </div>
            </div>

            {/* 댓글 */}
            <div className="col-span-3 flex h-full flex-col items-center justify-between overflow-hidden border">
              <Card.Card className="m-0 w-full rounded-none border-none p-3">
                <Card.CardContent className="flex items-center justify-between p-0">
                  <Link
                    href={`/user/${user.nickname}`}
                    className="flex items-center gap-2 text-sm font-semibold"
                    prefetch={false}>
                    <Avatar.Avatar className="h-8 w-8">
                      <Avatar.AvatarImage src={user.profile_image} alt={user.nickname} />
                      <Avatar.AvatarFallback>{user.nickname}</Avatar.AvatarFallback>
                    </Avatar.Avatar>
                    {user.nickname}
                  </Link>
                  <p
                    className="text-xs text-gray-300"
                    onClick={() => {
                      console.log(post.created_at);
                    }}>
                    {timeCheck(post.created_at)}
                  </p>
                </Card.CardContent>
              </Card.Card>

              <ScrollArea className="m-0 h-[70%] w-full rounded-none border-b">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none"> {post.contents}</h4>
                  <Separator className="my-3" />
                  {comments?.map((comment) => (
                    <div key={comment.id} className="p-2">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex">
                            <Avatar.Avatar className="h-6 w-6">
                              <Avatar.AvatarImage src={comment.user.profileImage} alt={comment.user.nickname} />
                              <Avatar.AvatarFallback>{comment.user.nickname}</Avatar.AvatarFallback>
                            </Avatar.Avatar>
                            <p className="ml-2">{comment.user.nickname}</p>
                          </div>
                          <p
                            className="text-xs text-gray-300"
                            onClick={() => {
                              console.log(comment.created_at);
                            }}>
                            {timeCheck(comment.created_at)}
                          </p>
                        </div>
                        <div className="flex w-full items-start text-sm">{comment.comment}</div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>

              <Buttons postId={post.id} userId={userId} />
              <div className="relative w-full">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  className="resize-none rounded-none border-b-0 border-l-0 border-r-0 border-t"
                  value={inputValue}
                  onChange={handleChange}
                />
                {inputValue && (
                  <Button className="absolute bottom-4 right-2" variant="ghost" onClick={handleCommentSubmit}>
                    <span style={{ color: 'hsl(214, 100%, 46%)' }}>등록</span>
                  </Button>
                )}
              </div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </div>
    </>
  );
}
