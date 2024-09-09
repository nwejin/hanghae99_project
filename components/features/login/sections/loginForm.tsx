'use client';

import TextInput from '../ui/textInput';
import LoginBtn from '../ui/loginBtn';
import InputLabel from '../ui/inputLabel';
import { useToast } from '@/components/common/ui/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/user';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAuth } from '@/lib/userAuth';
import { userLogIn } from '@/lib/login';
import { LoginType } from '@/lib/login';

export default function LoginForm() {
  const { toast } = useToast();
  // const { login, error, loading } = userAuth();
  const router = useRouter();

  const [error, setError] = useState('');

  const resolveForm = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    const { email, user_password } = data;
    const userLogin = await userLogIn(data);

    if (!userLogin) {
      toast({
        title: '로그인이 완료되었습니다.',
      });
      router.push('/');
    } else {
      // setError(userLogin);
      switch (userLogin) {
        case 'auth/invalid-credential':
          setError('이메일/비밀번호를 확인해주세요');
        case 'auth/user-not-found':
          setError('가입 정보가 없습니다.');
        case 'auth/wrong-password':
          setError('비밀번호를 확인해주세요');
        case 'auth/too-many-requests':
          setError('잠시 후 다시 시도해주세요');
        default:
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
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
            <TextInput type="password" name="user_password" id="user_password" placeholder="비밀번호" text="비밀번호" />
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
