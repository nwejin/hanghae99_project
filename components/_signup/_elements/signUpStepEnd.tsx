import TextInput from '../_ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { endSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';

interface FormProps {
  onSubmit: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  pet_image?: FileList;
  petName: string;
  petSpecies: string;
}

export default function SignUpStepEnd({ backStep, onSubmit }: FormProps) {
  const { handleSubmit } = useFormContext<StepData>();

  const finalSubmit = (data: StepData) => {
    // console.log('Final Step Data:', data);
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit(finalSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <TextInput type="file" name="pet_image" id="pet_image" placeholder="반려동물 사진" text="반려동물 사진" />
      </div>
      <div className="grid gap-2">
        <TextInput
          type="text"
          name="petName"
          id="petName"
          placeholder="친구의 이름을 알려주세요!"
          text="반려동물 이름"
        />
      </div>
      <div className="grid gap-2">
        <TextInput
          type="text"
          name="petSpecies"
          id="petSpecies"
          placeholder="친구는 어떤 종인가요?"
          text="반려동물 종"
        />
      </div>
      <div className="flex justify-end">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="회원가입" type="submit" />
      </div>
    </form>
  );
}
