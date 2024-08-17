import TextInput from '../_ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { midSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';
import { auth, app, firestore } from '@/config/firebase';
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useState } from 'react';

import { Input } from '@ui';
import { Label } from '@ui';

interface FormProps {
  nextStep: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  profile_image?: FileList;
  nickname: string;
  bio?: string;
}

export default function SignUpStepMid({ nextStep, backStep }: FormProps) {
  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useFormContext<StepData>();

  const checkNick = watch('nickname');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: StepData) => {
    // console.log('Step 2 Data:', data);

    try {
      const q = query(collection(firestore, 'users'), where('nickname', '==', String(checkNick)));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        nextStep(data);
      } else {
        setError('중복된 닉네임입니다!');
      }
    } catch (err) {
      console.error('닉네임 중복 체크 오류', err);
      setError('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <TextInput type="file" name="profile_image" id="profile_image" placeholder="프로필이미지" text="프로필이미지" />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="email" className="mr-2 text-base font-semibold">
            닉네임
          </Label>
          {error && <span className="text-sm text-red-500">{error}</span>}
          {errors['nickname'] && <span className="text-sm text-red-500">{errors['nickname']?.message as string}</span>}
        </div>

        <Input type="nickname" id="nickname" placeholder="닉네임" {...register('nickname')} className="mb-2" />
      </div>
      <div className="grid gap-2">
        <TextInput type="text" name="bio" id="bio" placeholder="자기소개" text="자기소개" />
      </div>
      <div className="flex justify-end">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="다음" type="submit" />
      </div>
    </form>
  );
}
