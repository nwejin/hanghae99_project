'use client';

import { Input } from '@/components/common';

import { useModalStore } from '@/store/modalStore';

import { useForm, FormProvider } from 'react-hook-form';
import { createClient } from '@/config/supabase/client';

import ImgCarousel from '../ui/carousel/imgCarousel';
import Contents from '../ui/contents';

import { PostFormData } from '@/lib/post';
import { useCreatePost } from '@/lib/post';

interface ModalFormProps {
  formRef?: React.RefObject<HTMLFormElement>;
}

export default function ModalForm({ formRef }: ModalFormProps) {
  const { closeModal } = useModalStore();

  const methods = useForm<PostFormData>({
    defaultValues: {
      userId: '',
      tags: [],
      created_at: '',
      photoDate: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = methods;

  const uploadImages = async (urls: string[]): Promise<string[]> => {
    const supabase = createClient();
    const uploadPromises: Promise<string>[] = [];

    for (const url of urls) {
      uploadPromises.push(
        fetch(url)
          .then((res) => res.blob())
          .then(async (blob) => {
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}_${url.split('/').pop()}`;
            const filePath = `images/${fileName}.webp`;

            const { error } = await supabase.storage
              .from('posts')
              .upload(filePath, blob, { contentType: 'image/webp' });

            if (error) throw error;

            const { data } = supabase.storage
              .from('posts')
              .getPublicUrl(filePath);

            return data.publicUrl;
          })
      );
    }

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  };

  const { mutate: createPost } = useCreatePost({
    onSuccess: () => {
      closeModal();
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!data.imgUrls || data.imgUrls.length === 0) {
      setError('imgUrls', { type: 'manual', message: '이미지를 최소 1개 이상 업로드해야 합니다.' });
      return;
    }
    if (!data.tags || data.tags.length === 0) {
      setError('tags', { type: 'manual', message: '태그를 최소 1개 이상 입력해주세요.' });
      return;
    }

    try {
      const imgUrls = await uploadImages(data.imgUrls as unknown as string[]);

      const postData: PostFormData = {
        ...data,
        imgUrls,
      };
      createPost(postData);
    } catch (error) {
      console.error('게시글 추가 에러', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
        <div className="w-full">
          <ImgCarousel />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-300">촬영 날짜</label>
            <Input type="date" {...register('photoDate', { required: '날짜를 선택해주세요.' })} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-300">태그</label>
            <Contents />
          </div>

          <div className="min-h-[20px]">
            {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
            {errors.imgUrls && <p className="text-sm text-red-500">{errors.imgUrls.message}</p>}
            {errors.photoDate && <p className="text-sm text-red-500">{errors.photoDate.message}</p>}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
