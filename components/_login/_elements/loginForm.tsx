'use client';

import TextInput from '../_ui/textInput';
import LoginBtn from '../_ui/loginBtn';
import InputLabel from '../_ui/inputLabel';
import { useToast } from '@/components/ui/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/user';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAuth } from '@/lib/userAuth';

interface userData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { toast } = useToast();
  const { login, error, loading } = userAuth();
  const router = useRouter();

  const resolveForm = useForm<userData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: userData) => {
    const { email, password } = data;
    const userLogin = await login(email, password);
    if (userLogin) {
      toast({
        title: '로그인이 완료되었습니다.',
      });
      router.push('/');
    }
  };

  return (
    <>
      <FormProvider {...resolveForm}>
        <form onSubmit={resolveForm.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <TextInput type="text" name="email" id="email" placeholder="pet@example.com" text="이메일" />
          </div>
          <div className="grid gap-2">
            <TextInput type="password" name="password" id="password" placeholder="비밀번호" text="비밀번호" />
          </div>

          {/* {success && <p className="text-green-500">{success}</p>} */}
          <LoginBtn />

          <span className="min-h-[20px] text-sm text-red-500">{error ? error : ''}</span>
          {/* {error && <span className="text-sm text-red-500">{error}</span>} */}
        </form>
      </FormProvider>
    </>
  );
}
