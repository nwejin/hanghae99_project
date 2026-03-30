'use client';

import TextInput from '../ui/textInput';
import SignUpBtn from '../ui/signUpBtn';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { createClient } from '@/config/supabase/client';

interface FormProps {
  nextStep: (data: StepData) => void;
}

interface StepData {
  user_id: string;
  email: string;
  user_pw: string;
  password_verify: string;
}

export default function SignUpStepStart({ nextStep }: FormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useFormContext<StepData>();

  const [error, setError] = useState<string | null>(null);

  const checkUserId = watch('user_id');

  const checkEmail = watch('email');

  const onSubmit = async (data: StepData) => {
    try {
      const supabase = createClient();

      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', String(checkUserId));

      if (queryError) throw queryError;

      if (existingUsers && existingUsers.length > 0) {
        setError('중복된 아이디입니다!');
        return;
      }

      const { data: existingEmails, error: emailQueryError } = await supabase
        .from('users')
        .select('email')
        .eq('email', String(checkEmail));

      if (emailQueryError) throw emailQueryError;

      if (existingEmails && existingEmails.length > 0) {
        setError('이미 사용 중인 이메일입니다!');
        return;
      }

      nextStep(data);
    } catch (error) {
      setError('정보 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <label htmlFor="user_id" className="text-xs font-semibold text-paw-sub">
            아이디
          </label>
          {error && <span className="text-xs text-red-500">{error}</span>}
          {errors['user_id'] && <span className="text-xs text-red-500">{errors['user_id']?.message as string}</span>}
        </div>
        <input
          type="text"
          id="user_id"
          placeholder="아이디를 입력해주세요"
          {...register('user_id')}
          className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
        />
      </div>
      <div>
        <div className="mb-1 flex items-center gap-2">
          <label htmlFor="email" className="text-xs font-semibold text-paw-sub">
            이메일
          </label>
          {errors['email'] && <span className="text-xs text-red-500">{errors['email']?.message as string}</span>}
        </div>
        <input
          type="email"
          id="email"
          placeholder="이메일을 입력해주세요"
          {...register('email')}
          className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
        />
      </div>
      <TextInput type="password" name="user_pw" id="user_pw" placeholder="비밀번호" text="비밀번호" />
      <TextInput
        type="password"
        name="password_verify"
        id="password_verify"
        placeholder="비밀번호 확인"
        text="비밀번호 확인"
      />
      <div className="flex justify-end pt-2">
        <SignUpBtn text="다음" type="submit" />
      </div>
    </form>
  );
}
