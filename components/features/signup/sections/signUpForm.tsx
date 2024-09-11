'use client';
import { useToast } from '@/components/common';
import { useForm, FormProvider } from 'react-hook-form';
import SignUpBtn from '../ui/signUpBtn';
import SignUpStepStart from './signUpStepStart';
import SignUpStepMid from './signUpStepMid';
import SignUpStepEnd from './signUpStepEnd';
import ProgressBar from '../ui/progressBar';
import useEmailStore from '@/store/emailStore';
import { doc, setDoc, collection } from 'firebase/firestore';
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

  const methods = useForm<FormData>({
    resolver: isStep === 1 ? zodResolver(userSchema) : undefined,
    mode: 'onChange',
  });

  const { setEmail } = useEmailStore();
  const { toast } = useToast();
  const { reset } = methods;

  const nextStep = (data: Partial<FormData>) => {
    setEmail(String(formData.email));
    // console.log('prew data', formData);
    // console.log('new Data', data);
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
    // console.log(userData.user_uid);
    try {
      if (userData.email && userData.user_pw) {
        const userRegister = await createUserWithEmailAndPassword(auth, userData.email, userData.user_pw);
        const user_uid = userRegister.user.uid;

        const userRef = doc(firestore, 'users', String(user_uid));
        await setDoc(userRef, {
          email: userData.email,
          password: userData.user_pw,

          profile_image: userData.profile_image,
          nickname: userData.nickname,
          bio: userData.bio || '',
        });

        if (userData.petName && userData.petSpecies) {
          const petsRef = collection(userRef, 'pets'); // 서브컬렉션 'pets'
          const petDocRef = doc(petsRef);
          await setDoc(petDocRef, {
            pet_image: userData.pet_image,
            petName: userData.petName,
            petSpecies: userData.petSpecies,
            petSubSpecies: userData.petSubSpecies,
          });
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
