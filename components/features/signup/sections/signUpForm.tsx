'use client';
import { useToast } from '@/components/common';
import { useForm, FormProvider } from 'react-hook-form';
import SignUpStepStart from './signUpStepStart';
import SignUpStepMid from './signUpStepMid';
import ProgressBar from '../ui/progressBar';
import { createClient } from '@/config/supabase/client';
import { useRouter } from 'next/navigation';
import { userLogIn } from '@/lib/login';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { userSchema } from '@/schemas/user';

interface FormData {
  user_id: string;
  email: string;
  user_pw: string;
  password_verify: string;
  profile_image?: string;
  nickname: string;
}

export default function SignUpForm() {
  const [isStep, setIsStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const router = useRouter();
  const supabase = createClient();

  const methods = useForm<FormData>({
    resolver: isStep === 1 ? zodResolver(userSchema) : undefined,
    mode: 'onChange',
  });

  const { toast } = useToast();
  const { reset } = methods;

  const nextStep = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setIsStep((prev) => prev + 1);
    reset();
  };

  const backStep = () => {
    setIsStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const userSubmit = async (data: Partial<FormData>) => {
    const userData = { ...formData, ...data };
    try {
      if (userData.user_id && userData.user_pw) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.user_pw,
        });

        if (authError) throw authError;

        const user_uid = authData.user?.id;
        if (!user_uid) throw new Error('사용자 ID를 가져올 수 없습니다.');

        const { error: userError } = await supabase.from('users').insert({
          id: user_uid,
          user_id: userData.user_id,
          email: userData.email,
          nickname: userData.nickname,
          profile_image: userData.profile_image || '',
        });

        if (userError) throw userError;

      }

      if (userData.user_id && userData.user_pw) {
        await userLogIn({
          user_id: userData.user_id,
          user_password: userData.user_pw,
        });
      }

      router.push('/');
      toast({
        title: '회원가입이 완료되었습니다.',
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <ProgressBar step={isStep} />
      <FormProvider {...methods}>
        {isStep === 1 && <SignUpStepStart nextStep={nextStep} />}
        {isStep === 2 && <SignUpStepMid nextStep={userSubmit} backStep={backStep} />}
      </FormProvider>
    </>
  );
}
