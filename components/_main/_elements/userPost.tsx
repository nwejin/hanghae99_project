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

import { PawPrint, Bookmark, FileWarning, Heart, Send, MessageCircle } from 'lucide-react';

export default function UserPost() {
  return (
    <Card className="mb-5 overflow-hidden rounded-md">
      <div className="grid gap-4">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="flex flex-row items-center p-4">
            <Link href="#" className="flex items-center gap-2 text-sm font-semibold" prefetch={false}>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="@birdlover" />
                <AvatarFallback>BL</AvatarFallback>
              </Avatar>
              닉네임
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
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724208401538_fe4b0db5-e954-46d9-bcea-f3717a6a0df9?alt=media&token=a2a81745-fbac-4906-a127-cbf28e61a6e7"
              width={600}
              height={600}
              alt="Pet Image"
              className="aspect-square object-cover"
            />
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
                <Link href="#" className="font-medium" prefetch={false}>
                  birdlover
                </Link>
                My parrot is the best! 🐦
              </div>
              <div>
                <Link href="#" className="font-medium" prefetch={false}>
                  featheredfriends
                </Link>
                Wow, what a beautiful bird! 😍
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
}
