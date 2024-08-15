'use client';
import { useToast } from '@/components/ui/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import SignUpBtn from '../_ui/signUpBtn';
import SignUpStepStart from './signUpStepStart';
import SignUpStepMid from './signUpStepMid';
import SignUpStepEnd from './signUpStepEnd';
import ProgressBar from '../_ui/progressBar';
import useEmailStore from '@/store/emailStore';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';
import { useRouter } from 'next/navigation';

// 유효성 검사
import { number, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useState, useEffect } from 'react';
import { userSchema, midSchema, endSchema } from '@/schemas/user';

interface FormData {
  email: string;
  password: string;
  password_verify: string;
  profile_image?: FileList;
  nickname: string;
  bio?: string;
  pet_image?: FileList;
  petName: string;
  petSpecies: string;
}

export default function SignUpForm() {
  const [isStep, setIsStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: isStep === 1 ? zodResolver(userSchema) : undefined,
    mode: 'onChange',
  });

  const { setEmail } = useEmailStore();
  const { toast } = useToast();
  const { reset } = methods;

  const nextStep = (data: Partial<FormData>) => {
    setEmail(String(formData.email));
    console.log('prew data', formData);
    console.log('new Data', data);
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
    console.log(userData);
    if (!userData.email || !userData.password) {
      setError('이메일과 비밀번호는 필수 항목입니다.');
      return;
    }
    try {
      const userRegister = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userRegister.user;

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        email: userData.email,
        nickname: userData.nickname,
        bio: userData.bio || '',
        petName: userData.petName,
        petSpecies: userData.petSpecies,
      });

      setSuccess('회원가입이 완료되었습니다.');
      setError(null);
      router.push('/login');
      toast({
        title: '회원가입이 완료되었습니다.',
      });
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('Updated formData:', formData);
  }, [formData]);

  return (
    <>
      <ProgressBar step={isStep} />
      <FormProvider {...methods}>
        {isStep === 1 && <SignUpStepStart nextStep={nextStep} />}
        {isStep === 2 && <SignUpStepMid nextStep={nextStep} backStep={backStep} />}
        {isStep === 3 && <SignUpStepEnd backStep={backStep} onSubmit={userSubmit} />}
      </FormProvider>

      {/* {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>} */}
    </>
  );
}
