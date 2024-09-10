import { Card, Button } from '@/components/common';
import Link from 'next/link';

import Header from '../ui/header';
import LoginForm from '../sections/loginForm';
import { ChevronRight } from 'lucide-react';

import cat from '@/public/cat_img.png';
import dog from '@/public/dog_img.png';
import Image from 'next/image';

export function Container() {
  return (
    <Card.Card className="h-[35rem] w-[20rem] items-center justify-center rounded-3xl pb-8 pt-8 shadow-md">
      <Header />
      <Card.CardContent className="flex h-[20rem] flex-col justify-evenly gap-y-2">
        <LoginForm />
      </Card.CardContent>
      <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <Button className="w-full" variant="ghost">
          <Link href="/signup" className="flex items-center">
            회원가입
            <ChevronRight size={16} />
          </Link>
        </Button>
        {/* <div className="mt-4 text-center text-sm">
          아직 계정이 없으신가요?
       
        </div> */}
      </Card.CardFooter>
    </Card.Card>
  );
}
