import { Card, LinkButton } from '@/components/common';

import SignUpForm from '../sections/signUpForm';
import ImgSection from '../sections/imgSection';
import Image from 'next/image';
import dog from '@/public/dog_img.png';
import cat from '@/public/cat_img.png';
import { LogoHeader } from '@/components/common';

export function Container() {
  return (
    <Card.Card className="grid h-[35rem] w-[50rem] grid-cols-2 rounded-3xl p-3 shadow-md">
      <Card.Card className="flex w-full flex-col justify-between rounded-none border-none p-4 shadow-none">
        <LogoHeader />
        <ImgSection />
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
