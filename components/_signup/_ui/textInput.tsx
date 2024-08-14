'use client';
import { Input } from '@ui';
import { Label } from '@ui';
import { TextInputProps } from '@type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ type, name, id, placeholder, text }: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const prevImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      // console.log(files[0]);
      const file = files[0];
      // 에러가 터질 수 있음
      const reader = new FileReader();
      // 파일을 읽은 후 호출되는 이벤트 핸들러
      reader.onloadend = () => {
        if (reader.result) {
          setImgPreview(reader.result as string); // 미리보기 URL 설정
        }
      };

      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  };

  const defaultImg = '/dog.png';

  return (
    <>
      <div className="flex items-center">
        <Label htmlFor={name} className="mr-2 text-base font-semibold">
          {text}
        </Label>
        {errors[name] && <span className="text-sm text-red-500">{errors[name]?.message as string}</span>}
      </div>

      {type == 'file' ? (
        <div className="flex">
          <Input
            type={type}
            id={id}
            placeholder={placeholder}
            {...register(name)}
            className="mb-2 mr-10 w-80"
            onChange={prevImg}
          />
          <Avatar className="w-100 border-gray-400 shadow-sm">
            {imgPreview ? (
              <AvatarImage src={imgPreview} alt="Image preview" />
            ) : (
              <AvatarImage src={defaultImg} alt="Default avatar" />
            )}
          </Avatar>
        </div>
      ) : (
        <Input type={type} id={id} placeholder={placeholder} {...register(name)} className="mb-2" />
      )}
    </>
  );
}
