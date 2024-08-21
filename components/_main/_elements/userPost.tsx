import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { PawPrint, Bookmark, FileWarning, Heart, Send, MessageCircle, Trash2 } from 'lucide-react';
import { Post, User } from '@/lib/getAllPost';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CarouselBtn from '../_ui/carouselBtn';

interface UserPostProps {
  post: Post;
  user: User;
}

export default function UserPost({ post, user }: UserPostProps) {
  //   console.log(post.imgUrls);

  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.email === user.email) {
      setIsOwner(true);
    }
  }, [user.email]);

  const handleDeletePost = async () => {
    console.log(post.id);
    try {
      await deleteDoc(doc(firestore, 'posts', post.id));
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
    }
  };
  return (
    <Card className="mb-5 overflow-hidden rounded-md">
      <div className="grid gap-4">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="flex flex-row items-center p-4">
            <Link
              href={`/user/${user.nickname}`}
              className="flex items-center gap-2 text-sm font-semibold"
              prefetch={false}>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={user.profile_image} alt={user.nickname} />
                <AvatarFallback>BL</AvatarFallback>
              </Avatar>
              {user.nickname}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full">
                  <PawPrint className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileWarning className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDeletePost}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            {/* 이미지 */}
            <Carousel className="max-w-xl">
              <CarouselContent>
                {post.imgUrls.map((img, index) => (
                  <CarouselItem>
                    <img src={img} width={600} height={600} alt="Pet Image" className="aspect-square object-cover" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {post.imgUrls.length === 0 ? '' : <CarouselBtn />}
            </Carousel>
          </CardContent>
          <CardFooter className="grid gap-2 p-2 pb-4">
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
            <div className="grid w-full gap-1.5 px-2 text-sm">
              <div>
                <Link href="#" className="mr-2 font-medium" prefetch={false}>
                  {user.nickname}
                </Link>
                {post.contents}
              </div>
              <div>
                <Link href="#" className="mr-2 font-medium" prefetch={false}>
                  댓글 작성자
                </Link>
                댓글
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
}
