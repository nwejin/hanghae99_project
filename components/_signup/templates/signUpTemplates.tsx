import { Card } from '@ui';
import Link from 'next/link';

import Header from '../atoms/header';
import TextInput from '../atoms/textInput';

import InputLabel from '../atoms/inputLabel';
import SignUpForm from '../molecules/signUpForm';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

export default function SignUpTemplates() {
  return (
    <Card.Card className="h-[35rem] w-[25rem] items-center justify-center shadow-md">
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
  );
}
