import { Card, LinkButton } from '@/components/common';

import { Header } from '@/components/features/login/';
import SignUpForm from '../sections/signUpForm';
import Image from 'next/image';
import dog from '@/public/dog_img.png';
import cat from '@/public/cat_img.png';

export function Container() {
  return (
    <Card.Card className="grid h-[35rem] w-[50rem] grid-cols-2 rounded-3xl p-3 shadow-lg">
      <Card.Card className="flex w-full flex-col justify-between rounded-none border-none p-4 shadow-none">
        <Header />
        <Card.CardContent className="flex items-end justify-center gap-y-2 p-0">
          <Image src={dog} alt="멍냥터 로고" width={130} className="mr-1" />
          <Image src={cat} alt="멍냥터 로고" width={130} className="ml-1" />
        </Card.CardContent>
        <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
          <LinkButton href="/login" text="로그인" />
        </Card.CardFooter>
      </Card.Card>

      <Card.Card className="flex items-center justify-center rounded-none border-none shadow-none">
        <Card.CardContent className="flex w-full flex-col p-4">
          <SignUpForm />
        </Card.CardContent>
      </Card.Card>
    </Card.Card>
  );
}
