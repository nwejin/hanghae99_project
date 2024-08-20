import { Card } from '@ui';
import { Input } from '@ui';
import { Button } from '@ui';

import { useModalStore } from '@/store/modalStore';

import { BadgePlus } from 'lucide-react';
import Image from 'next/image';
import testImg from '@/public/logo.png';
import { useState } from 'react';

import ImgCarousel from '../_ui/_carousel/imgCarousel';
import Contents from '../_ui/contents';
import Header from '../_ui/header';
import SwitchBtn from '../_ui/switchBtn';
import { userStore } from '@/store/userStore';
import { useForm, FormProvider } from 'react-hook-form';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';

interface PostFormData {
  userId: string;
  contents: string;
  imgUrls: [];
  created_at: string;
  likes: [];
  comments: [];
  status: boolean;
}

export default function ModalForm() {
  const { user, setUser } = userStore();
  const [formData, setFormData] = useState<Partial<PostFormData>>({});

  console.log(user);
  const date = new Date();

  const methods = useForm<PostFormData>({
    defaultValues: {
      userId: user,
      contents: '',
      imgUrls: [],
      status: true,
      created_at: new Date().toISOString(),
      likes: [],
      comments: [],
    },
  });

  const { handleSubmit, setValue, getValues } = methods;

  const [isPrivate, setIsPrivate] = useState(false);
  const handleSwitchChange = (value: boolean) => {
    setIsPrivate(value);
    setValue('status', value);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const storage = getStorage();
    const urls: string[] = [];

    for (const file of files) {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      urls.push(downloadURL);
    }

    return urls;
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      const imgUrls = await uploadImages(data.imgUrls as unknown as File[]);

      const updatedData = {
        ...data,
        imgUrls,
        created_at: new Date().toISOString(),
        status: isPrivate,
        userId: user,
      };

      // Firestore에 데이터 저장
      const docRef = await addDoc(collection(firestore, 'posts'), updatedData);

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <>
      <Card.Card className="relative z-10 h-[35rem] w-[50rem] items-center justify-center rounded-lg bg-white p-0 shadow-md">
        <Header />
        <Card.CardContent className="justify-betweenp-4 flex h-4/5 pt-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex h-full w-full">
              <div className="flex h-full w-3/4 justify-center">
                <ImgCarousel />
              </div>
              <div className="mt-2 w-2/5 flex-row">
                <Contents />
                <SwitchBtn isPrivate={isPrivate} onToggle={handleSwitchChange} />
                <div className="mt-16 flex items-center justify-end">
                  <Button>작성하기</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
