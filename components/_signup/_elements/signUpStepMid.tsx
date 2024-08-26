import TextInput from '../_ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { midSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../_ui/signUpBtn';
import { useFormContext } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RotateCcw } from 'lucide-react';

import { auth, app, firestore } from '@/config/firebase';
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { storage } from '@/config/firebase';

import { Input } from '@ui';
import { Label } from '@ui';
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';

interface FormProps {
  nextStep: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  profile_image?: string;
  nickname: string;
  bio?: string;
}

export default function SignUpStepMid({ nextStep, backStep }: FormProps) {
  const {
    handleSubmit,
    watch,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<StepData>();

  const checkNick = watch('nickname');
  const [error, setError] = useState<string | null>(null);

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
    'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/profile%2Fdefault_user.png?alt=media&token=24a62e1e-26b2-4adc-aa4c-29fefe3bc0bc';

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

  const onSubmit = async (data: StepData) => {
    console.log('Step 2 Data:', data);

    try {
      const q = query(collection(firestore, 'users'), where('nickname', '==', String(checkNick)));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const profileImageUrl = uploadedImgUrl ? uploadedImgUrl : defaultImg;

        const profileData = {
          ...data,
          profile_image: profileImageUrl,
        };

        nextStep(profileData);
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
        <div className="flex items-center">
          <Label htmlFor="profile_image" className="mr-2 text-base font-semibold">
            프로필 이미지
          </Label>
        </div>
        <div className="flex">
          <Input
            type="file"
            id="profile_image"
            placeholder="프로필이미지"
            className="mb-2 mr-6 w-80"
            onChange={prevImg}
            name='"profile_image'
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
        <div className="flex items-center">
          <Label htmlFor="email" className="mr-2 text-base font-semibold">
            닉네임
          </Label>
          {error && <span className="text-sm text-red-500">{error}</span>}
          {errors['nickname'] && <span className="text-sm text-red-500">{errors['nickname']?.message as string}</span>}
        </div>

        <Input
          type="text"
          id="nickname"
          placeholder="닉네임"
          {...register('nickname', {
            required: '닉네임을 입력해주세요',
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: '닉네임은 영어와 숫자만 입력 가능합니다.',
            },
          })}
          className="mb-2"
        />
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
