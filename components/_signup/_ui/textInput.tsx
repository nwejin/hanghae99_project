'use client';
import { Input } from '@ui';
import { Label } from '@ui';
import { TextInputProps } from '@type';
//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RotateCcw } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

import { storage } from '@/config/firebase';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import useEmailStore from '@/store/emailStore';
import { date } from 'zod';

export default function TextInput({ type, name, id, placeholder, text }: TextInputProps) {
  const {
    register,
    formState: { errors },
    getValues,
    watch,
  } = useFormContext();

  // 이미지 미리보기
  const [imgPreview, setImgPreview] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);

  const prevImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImgUrl(URL.createObjectURL(file));
    setImgPreview(file);

    const path = await uploadImg(file);
    setUploadedImgUrl(path);
  };

  const email = useEmailStore((state) => state.email);
  // console.log(email);

  const uploadImg = async (file: File) => {
    const values = getValues();
    let fileName = email;
    const time = new Date();

    if (id == 'nickname') {
      fileName = `${email}_profile`;
    } else if (id === 'petName') {
      fileName = `${email}_pet`;
    }
    const storageRef = ref(storage, `profile/${fileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    // console.log(downloadURL);
    return downloadURL;
  };

  const defaultImg = '/dog.png';

  const resetImg = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImgUrl('');
    setImgPreview(null);
  };

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
          <Input type={type} id={id} placeholder={placeholder} className="mb-2 mr-6 w-80" onChange={prevImg} />
          <Avatar className="border-gray-400 shadow-sm">
            {imgPreview ? (
              <AvatarImage src={imgUrl} alt="Image preview" />
            ) : (
              <AvatarImage src={defaultImg} alt="Default avatar" />
            )}
          </Avatar>
          {imgPreview ? (
            <button onClick={resetImg}>
              <RotateCcw className="white ml-3 h-4" size={18} color={'#333'} />
            </button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Input type={type} id={id} placeholder={placeholder} {...register(name)} className="mb-2" />
      )}
    </>
  );
}
