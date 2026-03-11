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
  user_id: string;
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

  const onSubmit = async (data: StepData) => {
    try {
      const supabase = createClient();

      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', String(checkUserId));

      if (queryError) throw queryError;

      if (!existingUsers || existingUsers.length === 0) {
        nextStep(data);
      } else {
        setError('중복된 아이디입니다!');
      }
    } catch (error) {
      setError('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="user_id" className="mr-2 text-base font-semibold">
            아이디
          </Label>
          {error && <span className="text-sm text-red-500">{error}</span>}
          {errors['user_id'] && <span className="text-sm text-red-500">{errors['user_id']?.message as string}</span>}
        </div>

        <Input type="text" id="user_id" placeholder="아이디를 입력해주세요" {...register('user_id')} className="mb-2" />
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
