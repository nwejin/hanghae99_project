'use client';
import { useToast } from '@/components/common';
import { useForm, FormProvider } from 'react-hook-form';
import SignUpStepStart from './signUpStepStart';
import SignUpStepMid from './signUpStepMid';
import SignUpStepEnd from './signUpStepEnd';
import ProgressBar from '../ui/progressBar';
import useEmailStore from '@/store/emailStore';
import { createClient } from '@/config/supabase/client';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { userSchema } from '@/schemas/user';

interface FormData {
  email: string;
  user_pw: string;
  password_verify: string;
  profile_image?: string;
  nickname: string;
  bio?: string;
  pet_image?: string;
  petName: string;
  petSpecies: string;
  petSubSpecies: string;
  user_uid: string;
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

  const { setEmail } = useEmailStore();
  const { toast } = useToast();
  const { reset } = methods;

  const nextStep = (data: Partial<FormData>) => {
    setEmail(String(formData.email));
    setFormData((prev) => ({ ...prev, ...data }));
    setIsStep((prev) => prev + 1);
    const mergedData = { ...formData, ...data };
    console.log('Merged data:', mergedData);
    reset();
  };

  const backStep = () => {
    setIsStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const userSubmit = async (data: Partial<FormData>) => {
    const userData = { ...formData, ...data };
    try {
      if (userData.email && userData.user_pw) {
        // Supabase Auth로 회원가입
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.user_pw,
        });

        if (authError) throw authError;

        const user_uid = authData.user?.id;
        if (!user_uid) throw new Error('사용자 ID를 가져올 수 없습니다.');

        // users 테이블에 프로필 정보 저장
        const { error: userError } = await supabase.from('users').insert({
          id: user_uid,
          email: userData.email,
          nickname: userData.nickname,
          profile_image: userData.profile_image || '',
          bio: userData.bio || '',
        });

        if (userError) throw userError;

        // pets 테이블에 반려동물 정보 저장
        if (userData.petName && userData.petSpecies) {
          const { error: petError } = await supabase.from('pets').insert({
            user_id: user_uid,
            pet_name: userData.petName,
            pet_species: userData.petSpecies,
            pet_sub_species: userData.petSubSpecies || '',
            pet_image: userData.pet_image || '',
          });

          if (petError) throw petError;
        }
      }

      router.push('/login');
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
        {isStep === 2 && <SignUpStepMid nextStep={nextStep} backStep={backStep} />}
        {isStep === 3 && <SignUpStepEnd backStep={backStep} onSubmit={userSubmit} />}
      </FormProvider>
    </>
  );
}
