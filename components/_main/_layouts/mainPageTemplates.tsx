/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Eenrr2xmenJ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
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

export default function MainPageTemplates() {
  return (
    <Card className="mx-auto max-w-[600px] overflow-hidden">
      <div className="grid gap-4">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="flex flex-row items-center p-4">
            <Link href="#" className="flex items-center gap-2 text-sm font-semibold" prefetch={false}>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="@birdlover" />
                <AvatarFallback>BL</AvatarFallback>
              </Avatar>
              BirdLover
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full">
                  <MoveHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <StarIcon className="mr-2 h-4 w-4" />
                  Add to favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileWarningIcon className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src="/placeholder.svg"
              width={600}
              height={600}
              alt="Pet Image"
              className="aspect-square object-cover"
            />
          </CardContent>
          <CardFooter className="grid gap-2 p-2 pb-4">
            <div className="flex w-full items-center">
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <Button variant="ghost" size="icon">
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="ghost" size="icon" className="ml-auto">
                <BookmarkIcon className="h-4 w-4" />
                <span className="sr-only">Save</span>
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

      <div className="grid gap-4">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="flex flex-row items-center p-4">
            <Link href="#" className="flex items-center gap-2 text-sm font-semibold" prefetch={false}>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="@birdlover" />
                <AvatarFallback>BL</AvatarFallback>
              </Avatar>
              BirdLover
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full">
                  <MoveHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <StarIcon className="mr-2 h-4 w-4" />
                  Add to favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileWarningIcon className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src="/placeholder.svg"
              width={600}
              height={600}
              alt="Pet Image"
              className="aspect-square object-cover"
            />
          </CardContent>
          <CardFooter className="grid gap-2 p-2 pb-4">
            <div className="flex w-full items-center">
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <Button variant="ghost" size="icon">
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="ghost" size="icon" className="ml-auto">
                <BookmarkIcon className="h-4 w-4" />
                <span className="sr-only">Save</span>
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

function BookmarkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function FileWarningIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
