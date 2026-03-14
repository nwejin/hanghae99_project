'use client';

import TextInput from '../ui/textInput';
import SignUpBtn from '../ui/signUpBtn';
import { useFormContext, Controller } from 'react-hook-form';
import { RotateCcw, Camera } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/config/supabase/client';
import { convertToWebP } from '@/shared/convertWebp';
import { Select } from '@/components/common';
import { petCategoryData } from '@/shared/petCategory';

interface FormProps {
  onSubmit: (data: StepData) => void;
  backStep: () => void;
}

interface StepData {
  pet_image?: string;
  petName: string;
  petSpecies: string;
  petSubSpecies: string;
}

export default function SignUpStepEnd({ backStep, onSubmit }: FormProps) {
  const { handleSubmit, register, setValue, watch, control } = useFormContext<StepData>();

  const [imgPreview, setImgPreview] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const supabase = createClient();

  const uploadImg = async (file: Blob) => {
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}_pet.webp`;

    const { error } = await supabase.storage.from('profiles').upload(filePath, file, { contentType: 'image/webp' });

    if (error) throw error;

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);

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

  const defaultImg = '/default_face.png';

  const resetImg = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (uploadedFilePath) {
      try {
        await supabase.storage.from('profiles').remove([uploadedFilePath]);

        setImgUrl('');
        setImgPreview(null);
        setUploadedImgUrl(null);
        setUploadedFilePath(null);

        const fileInput = document.getElementById('pet_image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (error) {
        console.error('이미지 삭제 중 오류 발생:', error);
      }
    }
  };

  const finalSubmit = (data: StepData) => {
    const profileImageUrl = uploadedImgUrl ? uploadedImgUrl : defaultImg;
    const petData = {
      ...data,
      pet_image: profileImageUrl,
    };
    onSubmit(petData);
  };

  const handleSpeciesChange = (species: any) => {
    setValue('petSpecies', species);
    setValue('petSubSpecies', '');
  };

  const watchedSpecies = watch('petSpecies') as keyof typeof petCategoryData;

  return (
    <form onSubmit={handleSubmit(finalSubmit)} className="flex flex-col gap-4">
      {/* 반려동물 이미지 */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-paw-sub">반려동물 이미지</label>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-paw-border bg-paw-cream-dark">
            <img src={imgPreview ? imgUrl : defaultImg} alt="반려동물" className="h-full w-full object-cover" />
            <label
              htmlFor="pet_image"
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
              <Camera size={16} className="text-white" />
            </label>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <label
              htmlFor="pet_image"
              className="cursor-pointer rounded-xl border border-paw-border px-3 py-2 text-xs text-paw-sub transition-colors hover:text-paw-main">
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
            id="pet_image"
            className="hidden"
            onChange={prevImg}
            name="pet_image"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
        </div>
      </div>

      <TextInput type="text" name="petName" id="petName" placeholder="친구의 이름을 알려주세요!" text="반려동물 이름" />

      {/* 반려동물 종류 */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-paw-sub">반려동물 정보</label>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="petSpecies"
            control={control}
            render={({ field }) => (
              <Select.Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSpeciesChange(value as keyof typeof petCategoryData);
                }}>
                <Select.SelectTrigger className="rounded-xl border-paw-border bg-paw-cream-dark text-sm">
                  <Select.SelectValue placeholder="대분류" />
                </Select.SelectTrigger>
                <Select.SelectContent>
                  <Select.SelectItem value="dog">강아지</Select.SelectItem>
                  <Select.SelectItem value="cat">고양이</Select.SelectItem>
                  <Select.SelectItem value="other">기타</Select.SelectItem>
                </Select.SelectContent>
              </Select.Select>
            )}
          />
          <Controller
            name="petSubSpecies"
            control={control}
            render={({ field }) => (
              <Select.Select onValueChange={field.onChange}>
                <Select.SelectTrigger className="rounded-xl border-paw-border bg-paw-cream-dark text-sm">
                  <Select.SelectValue placeholder="중분류" />
                </Select.SelectTrigger>
                <Select.SelectContent>
                  {watchedSpecies &&
                    petCategoryData[watchedSpecies]?.map((subspecies) => (
                      <Select.SelectItem key={subspecies.value} value={subspecies.value}>
                        {subspecies.label}
                      </Select.SelectItem>
                    ))}
                </Select.SelectContent>
              </Select.Select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="회원가입" type="submit" />
      </div>
    </form>
  );
}
