'use client';

import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '../_ui/textInput';
import InputLabel from '../_ui/inputLabel';
import SignUpBtn from '../_ui/signUpBtn';

// 유효성 검사
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { userSchema } from '@/schemas/user';
import { auth } from '@/config/firebase';

export default function SignUpForm() {
  const resolveForm = useForm({
    resolver: zodResolver(userSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userSubmit = async (data: any) => {
    const { email, password } = data;

    try {
      const userRegister = await createUserWithEmailAndPassword(auth, email, password);
      const user = userRegister.user;
      setSuccess('회원가입이 완료되었습니다.');

      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
      console.log(error);
    }
  };

  return (
    <>
      <FormProvider {...resolveForm}>
        <form onSubmit={resolveForm.handleSubmit(userSubmit)} className="grid gap-4">
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

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <SignUpBtn />
        </form>
      </FormProvider>
    </>
  );
}
