'use client';

import { useForm, FormProvider } from 'react-hook-form';
import SignUpBtn from '../_ui/signUpBtn';
import SignUpStepStart from './signUpStepStart';
import SignUpStepMid from './signUpStepMid';
import SignUpStepEnd from './signUpStepEnd';
import ProgressBar from '../_ui/progressBar';

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

  const {
    formState: { isValid },
  } = resolveForm;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isStep, setIsStep] = useState(1);

  const nextStep = () => setIsStep((prev) => prev + 1);
  const backStep = () => setIsStep((prev) => (prev > 1 ? prev - 1 : 1));

  const userSubmit = async (data: any) => {
    if (isStep === 3) {
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
    } else {
      nextStep();
    }
  };

  return (
    <>
      <ProgressBar step={isStep} />
      <FormProvider {...resolveForm}>
        <form onSubmit={resolveForm.handleSubmit(userSubmit)} className="">
          {isStep == 1 && <SignUpStepStart />}
          {isStep == 2 && <SignUpStepMid />}
          {isStep == 3 && <SignUpStepEnd />}

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div className="flex justify-end">
            {isStep == 1 && <SignUpBtn text="다음" />}
            {isStep == 2 && (
              <>
                <SignUpBtn text="이전" onClick={backStep} />
                <SignUpBtn text="다음" disabled={!isValid} />
              </>
            )}
            {isStep == 3 && (
              <>
                <SignUpBtn text="이전" onClick={backStep} />
                <SignUpBtn text="회원가입" disabled={!isValid} />
              </>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
}
