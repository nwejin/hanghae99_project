'use client';

import TextInput from '../ui/textInput';
import SignUpBtn from '../ui/signUpBtn';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common';
import { Label } from '@/components/common';
import { useState } from 'react';
import { createClient } from '@/config/supabase/client';

interface FormProps {
  nextStep: (data: StepData) => void;
}

interface StepData {
  email: string;
  user_pw: string;
  password_verify: string;
  user_uid: string;
}

export default function SignUpStepStart({ nextStep }: FormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    watch,
  } = useFormContext<StepData>();

  const [error, setError] = useState<string | null>(null);

  const checkEmail = watch('email');

  const onSubmit = async (data: StepData) => {
    try {
      const supabase = createClient();

      // Supabase에서 이메일 중복 체크
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('email')
        .eq('email', String(checkEmail));

      if (queryError) throw queryError;

      if (!existingUsers || existingUsers.length === 0) {
        const authData = { ...data };
        nextStep(authData);
      } else {
        setError('중복된 이메일입니다!');
      }
    } catch (error) {
      setError('이메일 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="email" className="mr-2 text-base font-semibold">
            이메일
          </Label>
          {error && <span className="text-sm text-red-500">{error}</span>}
          {errors['email'] && <span className="text-sm text-red-500">{errors['email']?.message as string}</span>}
        </div>

        <Input type="text" id="email" placeholder="pet@example.com" {...register('email')} className="mb-2" />
      </div>
      <div className="grid gap-2">
        <TextInput type="password" name="user_pw" id="user_pw" placeholder="비밀번호" text="비밀번호" />
      </div>
      <div className="grid gap-2">
        <TextInput
          type="password"
          name="password_verify"
          id="password_verify"
          placeholder="비밀번호 확인"
          text="비밀번호 확인"
        />
      </div>
      <div className="flex justify-end">
        <SignUpBtn text="다음" type="submit" />
      </div>
    </form>
  );
}
