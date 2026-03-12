'use client';

import { useFormContext } from 'react-hook-form';
import SignUpBtn from '../ui/signUpBtn';
import { RotateCcw, Camera } from 'lucide-react';
import { createClient } from '@/config/supabase/client';
import { useState } from 'react';
import { convertToWebP } from '@/shared/convertWebp';

interface FormProps {
  nextStep: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  profile_image?: string;
  nickname: string;
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

  const [imgPreview, setImgPreview] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const supabase = createClient();

  const uploadImg = async (file: Blob) => {
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

  const prevImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImgUrl(URL.createObjectURL(file));
    setImgPreview(file);

    const webpBlob = await convertToWebP(file);
    if (!webpBlob) return;
    const path = await uploadImg(webpBlob);
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

        setImgUrl('');
        setImgPreview(null);
        setUploadedImgUrl(null);
        setUploadedFilePath(null);

        const fileInput = document.getElementById('profile_image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (error) {
        console.error('이미지 삭제 중 오류 발생:', error);
      }
    }
  };

  const onSubmit = async (data: StepData) => {
    try {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* 프로필 이미지 */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-paw-sub">프로필 이미지</label>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-paw-border bg-paw-cream-dark">
            <img
              src={imgPreview ? imgUrl : defaultImg}
              alt="프로필"
              className="h-full w-full object-cover"
            />
            <label
              htmlFor="profile_image"
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100"
            >
              <Camera size={16} className="text-white" />
            </label>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <label
              htmlFor="profile_image"
              className="cursor-pointer rounded-xl border border-paw-border px-3 py-2 text-xs text-paw-sub transition-colors hover:text-paw-orange"
            >
              사진 선택
            </label>
            {imgPreview && (
              <button onClick={resetImg} type="button" className="text-paw-sub hover:text-red-400">
                <RotateCcw size={14} />
              </button>
            )}
          </div>
          <input
            type="file"
            id="profile_image"
            className="hidden"
            onChange={prevImg}
            name="profile_image"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
        </div>
      </div>

      {/* 닉네임 */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <label htmlFor="nickname" className="text-xs font-semibold text-paw-sub">
            닉네임
          </label>
          {error && <span className="text-xs text-red-500">{error}</span>}
          {errors['nickname'] && <span className="text-xs text-red-500">{errors['nickname']?.message as string}</span>}
        </div>
        <input
          type="text"
          id="nickname"
          placeholder="닉네임 (2글자 이상)"
          {...register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: { value: 2, message: '닉네임은 2글자 이상이어야 합니다' },
          })}
          className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-orange"
        />
      </div>

      <div className="flex justify-between pt-2">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="다음" type="submit" />
      </div>
    </form>
  );
}
