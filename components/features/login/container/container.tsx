import { Card, LinkButton } from '@/components/common';

import { LogoHeader } from '@/components/common';
import LoginForm from '../sections/loginForm';

export function Container() {
  return (
    <div className="h-[35rem] w-full items-center justify-center rounded-3xl pb-8 pt-8 sm:w-[30rem]">
      <LogoHeader />
      <Card.CardContent className="flex h-[20rem] flex-col justify-evenly gap-y-2">
        <LoginForm />
      </Card.CardContent>
      <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <LinkButton href="/signup" text="회원가입" />
      </Card.CardFooter>
    </div>
  );
}
