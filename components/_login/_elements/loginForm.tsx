'use client';

import TextInput from '../_ui/textInput';
import LoginBtn from '../_ui/loginBtn';
import InputLabel from '../_ui/inputLabel';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/user';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useState } from 'react';

export default function LoginForm() {
  const resolveForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('로그인 성공', userCredential);
      setSuccess('로그인 완료되었습니다.');
      setError(null);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <>
      <FormProvider {...resolveForm}>
        <form onSubmit={resolveForm.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <InputLabel name="email" text="이메일" />
            <TextInput type="text" name="email" id="email" placeholder="pet@example.com" />
          </div>
          <div className="grid gap-2">
            <InputLabel name="password" text="비밀번호" />
            <TextInput type="password" name="password" id="password" placeholder="비밀번호" />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <LoginBtn />
        </form>
      </FormProvider>
    </>
  );
}
