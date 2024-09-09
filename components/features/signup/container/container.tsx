import { Card } from '@/components/common';
import Link from 'next/link';

import Header from '../ui/header';
import SignUpForm from '../sections/signUpForm';

export function Container() {
  return (
    <>
      <Card.Card className="h-[35rem] w-[30rem] items-center justify-center shadow-md">
        <Header />
        <Card.CardContent className="flex flex-col gap-y-2 pb-4">
          <SignUpForm />
        </Card.CardContent>
        <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
          <div className="mt-4 text-center text-sm">
            계정이 있으신가요?{' '}
            <Link href="/login" className="underline">
              로그인
            </Link>
          </div>
        </Card.CardFooter>
      </Card.Card>
    </>
  );
}
