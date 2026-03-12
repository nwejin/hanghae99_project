'use client';

import TextInput from '../ui/textInput';
import LoginBtn from '../ui/loginBtn';
import { useToast } from '@/components/common/ui/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/user';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userLogIn } from '@/lib/login';
import { LoginType } from '@/lib/login';

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const [error, setError] = useState('');

  const resolveForm = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    const userLogin = await userLogIn(data);

    if (!userLogin) {
      toast({
        title: '로그인이 완료되었습니다.',
      });
      router.push('/');
    } else {
      setError('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <FormProvider {...resolveForm}>
      <form onSubmit={resolveForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextInput type="text" name="user_id" id="user_id" placeholder="아이디를 입력해주세요" text="아이디" />
        <TextInput type="password" name="user_password" id="user_password" placeholder="비밀번호" text="비밀번호" />
        <div className="pt-2">
          <LoginBtn />
        </div>
        {error && (
          <p className="text-center text-xs text-red-500">{error}</p>
        )}
      </form>
    </FormProvider>
  );
}
