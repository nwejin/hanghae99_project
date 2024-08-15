import TextInput from '../_ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { midSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';

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
  const { handleSubmit } = useFormContext<StepData>();
  const onSubmit = (data: StepData) => {
    console.log('Step 2 Data:', data);
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <TextInput type="file" name="profile_image" id="profile_image" placeholder="프로필이미지" text="프로필이미지" />
      </div>
      <div className="grid gap-2">
        <TextInput type="text" name="nickname" id="nickname" placeholder="닉네임" text="닉네임" />
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
