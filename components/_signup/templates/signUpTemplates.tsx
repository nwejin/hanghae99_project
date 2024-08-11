import { Card } from '@ui';
import Link from 'next/link';

import Header from '../atoms/header';
import TextInput from '../atoms/textInput';
import LoginBtn from '../atoms/signUpBtn';
import InputLabel from '../atoms/inputLabel';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

export default function SignUpTemplates() {
  return (
    <Card.Card className="h-[35rem] w-[25rem] items-center justify-center shadow-md">
      <Header />
      <Card.CardContent className="flex flex-col gap-y-2 pb-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <InputLabel name="userId" text="아이디" />
            <TextInput type="text" name="userId" id="userId" placeholder="아이디" />
          </div>
          <div className="grid gap-2">
            <InputLabel name="email" text="이메일" />
            <TextInput type="text" name="email" id="email" placeholder="pet@example.com" />
          </div>
          <div className="grid gap-2">
            <InputLabel name="password" text="비밀번호" />
            <TextInput type="password" name="password" id="password" placeholder="비밀번호" />
          </div>
          <div className="grid gap-2">
            <InputLabel name="password_verify" text="비밀번호 확인" />
            <TextInput type="password" name="password_verify" id="password_verify" placeholder="비밀번호 확인" />
          </div>
        </div>
        <LoginBtn />
        <div className="mt-4 text-center text-sm">
          계정이 있으신가요?{' '}
          <Link href="/login" className="underline">
            로그인
          </Link>
        </div>
      </Card.CardContent>

      {/* <Card.CardFooter className="flex flex-col gap-y-2 pb-4">
        <LoginBtn />
        <div className="mt-4 text-center text-sm">
          계정이 있으신가요?{' '}
          <Link href="/login" className="underline">
            로그인
          </Link>
        </div>
      </Card.CardFooter> */}
    </Card.Card>
  );
}
