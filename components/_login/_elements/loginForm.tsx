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

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const resolveForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log('로그인 성공', userCredential);
      router.push('/');
      toast({
        title: '로그인이 완료되었습니다.',
      });
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
            <TextInput type="text" name="email" id="email" placeholder="pet@example.com" text="이메일" />
          </div>
          <div className="grid gap-2">
            <TextInput type="password" name="password" id="password" placeholder="비밀번호" text="비밀번호" />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <LoginBtn />
        </form>
      </FormProvider>
    </>
  );
}
