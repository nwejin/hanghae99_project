import { Card } from '@ui';
import Link from 'next/link';

import Header from '../_ui/header';
import LoginForm from '../_elements/loginForm';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

export default function SignUpTemplates() {
  return (
    <Card.Card className="h-[35rem] w-[25rem] items-center justify-center shadow-md">
      <Header />
      <Card.CardContent className="flex flex-col gap-y-2 pb-4">
        <LoginForm />
      </Card.CardContent>
      <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <div className="mt-4 text-center text-sm">
          회원이 아니신가요??{' '}
          <Link href="/signup" className="underline">
            회원가입
          </Link>
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
