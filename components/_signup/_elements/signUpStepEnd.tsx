import TextInput from '../_ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { endSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';

import { RotateCcw } from 'lucide-react';

import { Input } from '@ui';
import { Label } from '@ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';

interface FormProps {
  onSubmit: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  pet_image?: string;
  petName: string;
  petSpecies: string;
}

export default function SignUpStepEnd({ backStep, onSubmit }: FormProps) {
  const { handleSubmit } = useFormContext<StepData>();

  const [imgPreview, setImgPreview] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);

  const uploadImg = async (file: File) => {
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `profile/${timestamp}_profile`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    // console.log(downloadURL);
    return downloadURL;
  };

  // 이미지 미리보기
  const prevImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImgUrl(URL.createObjectURL(file));
    setImgPreview(file);

    const path = await uploadImg(file);
    setUploadedImgUrl(path);
  };

  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/profile%2Fdefault_pet.png?alt=media&token=7c292342-4cf1-4dc9-ad91-4ff0fa6efbff';

  const resetImg = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (uploadedImgUrl) {
      try {
        // Storage 참조 가져오기
        const storageRef = ref(storage, uploadedImgUrl);
        // 파일 삭제
        await deleteObject(storageRef);

        // 상태 초기화
        setImgUrl('');
        setImgPreview(null);
        setUploadedImgUrl(null);

        const fileInput = document.getElementById('profile_image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // 입력값 초기화
        }

        console.log('이미지가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('이미지 삭제 중 오류 발생:', error);
      }
    } else {
      console.log('삭제할 이미지가 없습니다.');
    }
  };

  const finalSubmit = (data: StepData) => {
    const profileImageUrl = uploadedImgUrl ? uploadedImgUrl : defaultImg;

    const petData = {
      ...data,
      pet_image: profileImageUrl,
    };

    // console.log('Final Step Data:', data);
    onSubmit(petData);
  };

  return (
    <form onSubmit={handleSubmit(finalSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="profile_image" className="mr-2 text-base font-semibold">
            반려동물 이미지
          </Label>
        </div>
        <div className="flex">
          <Input
            type="file"
            id="pet_image"
            placeholder="반려동물 이미지"
            className="mb-2 mr-6 w-80"
            onChange={prevImg}
            name='"pet_image'
          />
          <Avatar className="border-gray-400 shadow-sm">
            {imgPreview ? (
              <AvatarImage src={imgUrl} alt="Image preview" />
            ) : (
              <AvatarImage src={defaultImg} alt="Default avatar" />
            )}
          </Avatar>
          {imgPreview ? (
            <button onClick={resetImg} type="button">
              <RotateCcw className="white ml-3 h-4" size={18} color={'#333'} />
            </button>
          ) : (
            <></>
          )}
        </div>
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
