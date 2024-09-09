'use client';
import { Input } from '@/components/common';
import { Label } from '@/components/common';
import { TextInputProps } from '@type';
//
import { Avatar } from '@/components/common';
import { RotateCcw } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

import { storage } from '@/config/firebase';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import useEmailStore from '@/store/emailStore';

export default function TextInput({ type, name, id, placeholder, text }: TextInputProps) {
  const {
    register,
    formState: { errors },
    getValues,
    watch,
  } = useFormContext();

  return (
    <>
      <div className="flex items-center">
        <Label htmlFor={name} className="mr-2 text-base font-semibold">
          {text}
        </Label>
        {errors[name] && <span className="text-sm text-red-500">{errors[name]?.message as string}</span>}
      </div>
      <Input type={type} id={id} placeholder={placeholder} {...register(name)} className="mb-2" />
    </>
  );
}
