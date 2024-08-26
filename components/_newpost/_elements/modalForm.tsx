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
import { PostFormData } from '@/lib/post';
import { addPost } from '@/lib/post';

// interface PostFormData {
//   userId: string;
//   contents: string;
//   imgUrls: [];
//   created_at: string;
//   comments: [];
//   status: boolean;
// }

export default function ModalForm() {
  const { closeModal } = useModalStore();
  const { user, setUser } = userStore();
  const [formData, setFormData] = useState<Partial<PostFormData>>({});

  // console.log(user);
  const date = new Date();

  // console.log(auth);
  // console.log(user);

  const methods = useForm<PostFormData>({
    defaultValues: {
      userId: user,
      contents: '',
      status: true,
      created_at: new Date().toISOString(),
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = methods;

  const [isPrivate, setIsPrivate] = useState(false);
  const handleSwitchChange = (value: boolean) => {
    setIsPrivate(value);
    setValue('status', value);
  };

  const uploadImages = async (urls: string[]): Promise<string[]> => {
    const storage = getStorage();
    const uploadPromises: Promise<string>[] = [];

    for (const url of urls) {
      uploadPromises.push(
        fetch(url)
          .then((res) => res.blob()) // `blob` URL을 파일로 변환
          .then((blob) => {
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}_${url.split('/').pop()}`; // 고유한 파일 이름 생성
            const storageRef = ref(storage, `images/${fileName}`);

            return uploadBytes(storageRef, blob).then(() => getDownloadURL(storageRef));
          })
      );
    }

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  };

  const onSubmit = async (data: PostFormData) => {
    if (data.imgUrls.length === 0) {
      setError('imgUrls', { type: 'manual', message: '이미지를 최소 1개 이상 업로드해야 합니다.' });
    }
    if (!data.contents) {
      setError('contents', { type: 'manual', message: '내용을 입력해주세요.' });
    }
    if (data.imgUrls.length > 0 && data.contents) {
      try {
        const imgUrls = await uploadImages(data.imgUrls as unknown as string[]);

        if (user == '') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요');
        } else {
          // const updatedData = {
          //   ...data,
          //   imgUrls,
          //   created_at: new Date().toISOString(),
          //   status: isPrivate,
          //   userId: user,
          // };

          const postData: PostFormData = {
            ...data,
            imgUrls,
            created_at: new Date().toISOString(),
            status: isPrivate,
            userId: user,
          };

          // const docRef = await addDoc(collection(firestore, 'posts'), postData);
          // console.log('Document written with ID: ', docRef.id);
          await addPost(postData);

          closeModal();
        }
      } catch (error) {
        console.error('게시글 추가 에러', error);
      }
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
                <div className="mt-2 h-10">
                  {errors.contents && <p className="text-sm text-red-500">{errors.contents.message}</p>}
                  {errors.imgUrls && <p className="text-sm text-red-500">{errors.imgUrls.message}</p>}
                </div>
                <div className="mt-4 flex items-center justify-end">
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
