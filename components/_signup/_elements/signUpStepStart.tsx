import TextInput from '../_ui/textInput';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Input } from '@ui';
import { Label } from '@ui';
import { useEffect } from 'react';

interface FormProps {
  nextStep: (data: StepData) => void;
}

interface StepData {
  email: string;
  user_pw: string;
  password_verify: string;
}

export default function SignUpStepStart({ nextStep }: FormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    watch,
    setError,
  } = useFormContext<StepData>();

  const onSubmit = (data: StepData) => {
    console.log(data);
    nextStep(data);
  };

  // const auth = getAuth();

  // const checkEmailExists = async (email: string) => {
  //   const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  //   return signInMethods.length > 0;
  // };

  // const onSubmit = async (data: StepData) => {
  //   const emailExists = await checkEmailExists(data.email);

  //   if (emailExists) {
  //     setError('email', {
  //       type: 'manual',
  //       message: '중복된 이메일입니다.',
  //     });
  //   } else {
  //     nextStep(data);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <TextInput type="text" name="email" id="email" placeholder="pet@example.com" text="이메일" />
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
