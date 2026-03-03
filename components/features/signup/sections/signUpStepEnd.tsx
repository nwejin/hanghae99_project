'use client';

import TextInput from '../ui/textInput';
import { useForm, FormProvider } from 'react-hook-form';
import { endSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpBtn from '../ui/signUpBtn';
import { useFormContext, Controller } from 'react-hook-form';

import { RotateCcw } from 'lucide-react';

import { Input } from '@/components/common';
import { Label } from '@/components/common';
import { Avatar } from '@/components/common';
import { useState } from 'react';
import { createClient } from '@/config/supabase/client';
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

  const uploadImg = async (file: File) => {
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}_pet.webp`;

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

  const defaultImg = '/default_pet.png';

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
            className="mb-2 mr-6"
            onChange={prevImg}
            name='"pet_image'
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
        <TextInput
          type="text"
          name="petName"
          id="petName"
          placeholder="친구의 이름을 알려주세요!"
          text="반려동물 이름"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="petSpecies" className="mr-2 text-base font-semibold">
          반려동물 정보
        </Label>
        <div className="mb-2 grid grid-cols-6 gap-2">
          <div className="col-span-3">
            <Controller
              name="petSpecies"
              control={control}
              render={({ field }) => (
                <Select.Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSpeciesChange(value as keyof typeof petCategoryData);
                  }}>
                  <Select.SelectTrigger>
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
          </div>
          <div className="col-span-3">
            <Controller
              name="petSubSpecies"
              control={control}
              render={({ field }) => (
                <Select.Select onValueChange={field.onChange}>
                  <Select.SelectTrigger>
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
      </div>
      <div className="flex justify-between">
        <SignUpBtn text="이전" type="button" onClick={backStep} />
        <SignUpBtn text="회원가입" type="submit" />
      </div>
    </form>
  );
}
