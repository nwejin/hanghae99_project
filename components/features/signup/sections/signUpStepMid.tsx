'use client';

import TextInput from '../ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { midSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../ui/signUpBtn';
import { useFormContext } from 'react-hook-form';

import { Avatar } from '@/components/common';
import { RotateCcw } from 'lucide-react';

import { createClient } from '@/config/supabase/client';
import { useState } from 'react';

import { Input } from '@/components/common';
import { Label } from '@/components/common';

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
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const supabase = createClient();

  const uploadImg = async (file: File) => {
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}_profile.webp`;

    const { error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { contentType: 'image/webp' });

    if (error) throw error;

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    setUploadedFilePath(filePath);
    return data.publicUrl;
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

  const defaultImg = '/default_user.png';

  const resetImg = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (uploadedFilePath) {
      try {
        await supabase.storage
          .from('profiles')
          .remove([uploadedFilePath]);

        // 상태 초기화
        setImgUrl('');
        setImgPreview(null);
        setUploadedImgUrl(null);
        setUploadedFilePath(null);

        const fileInput = document.getElementById('profile_image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
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
    try {
      // Supabase에서 닉네임 중복 체크
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('nickname')
        .eq('nickname', String(checkNick));

      if (queryError) throw queryError;

      if (!existingUsers || existingUsers.length === 0) {
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
            className="mb-2 mr-6"
            onChange={prevImg}
            name='"profile_image'
          />
          <Avatar.Avatar className="border-gray-400 shadow-sm">
            {imgPreview ? (
              <Avatar.AvatarImage src={imgUrl} alt="Image preview" />
            ) : (
              <Avatar.AvatarImage src={defaultImg} alt="Default avatar" />
            )}
          </Avatar.Avatar>
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
      <div className="flex justify-between">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="다음" type="submit" />
      </div>
    </form>
  );
}
