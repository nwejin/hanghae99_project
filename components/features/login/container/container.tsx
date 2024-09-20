import { Card, LinkButton } from '@/components/common';

import { LogoHeader } from '@/components/common';
import LoginForm from '../sections/loginForm';

export function Container() {
  return (
    <Card.Card className="h-[35rem] w-[25rem] items-center justify-center rounded-3xl pb-8 pt-8 shadow-md">
      <LogoHeader />
      <Card.CardContent className="flex h-[20rem] flex-col justify-evenly gap-y-2">
        <LoginForm />
      </Card.CardContent>
      <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <LinkButton href="/signup" text="회원가입" />
      </Card.CardFooter>
    </Card.Card>
  );
}
