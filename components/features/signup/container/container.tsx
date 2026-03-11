import { Card, LinkButton } from '@/components/common';

import SignUpForm from '../sections/signUpForm';
import Image from 'next/image';
import { dog_img, cat_img } from '@/public';

export function Container() {
  return (
    <div className="h-auto w-full items-center justify-center rounded-3xl pb-8 pt-8 sm:w-[30rem]">
      <div className="mb-4 flex items-end justify-center">
        <Image src={dog_img} alt="dog" width={130} className="mr-1" />
        <Image src={cat_img} alt="cat" width={130} className="mr-1" />
      </div>
      <Card.CardContent className="flex w-full flex-col p-4">
        <SignUpForm />
      </Card.CardContent>
      <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <LinkButton href="/login" text="로그인" />
      </Card.CardFooter>
    </div>
  );
}
