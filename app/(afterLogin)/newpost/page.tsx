'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/config/supabase/client';
import { Input } from '@/components/common';
import { PostFormData, useCreatePost } from '@/lib/post';
import ImgCarousel from '@/components/features/newpost/ui/carousel/imgCarousel';
import Contents from '@/components/features/newpost/ui/contents';
import { useState } from 'react';

export default function NewPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

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

    return Promise.all(uploadPromises);
  };

  const { mutate: createPost } = useCreatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POST_KEY'] });
      router.push('/');
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!data.imgUrls || data.imgUrls.length === 0) {
      setError('imgUrls', { type: 'manual', message: '이미지를 최소 1개 이상 업로드해야 합니다.' });
      return;
    }
    setSubmitting(true);
    try {
      const imgUrls = await uploadImages(data.imgUrls as unknown as string[]);
      const postData: PostFormData = { ...data, imgUrls };
      createPost(postData);
    } catch (error) {
      console.error('게시글 추가 에러', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* 이미지 업로드 */}
          <ImgCarousel />

          {/* 촬영 날짜 */}
          <div className="rounded-2xl border border-paw-border bg-white p-4">
            <label className="mb-1.5 block text-xs font-semibold text-paw-sub">촬영 날짜</label>
            <Input
              type="date"
              {...register('photoDate', { required: '날짜를 선택해주세요.' })}
              className="rounded-xl border-paw-border bg-paw-cream-dark text-sm text-paw-brown focus:ring-paw-orange"
            />
          </div>

          {/* 태그 */}
          <div className="rounded-2xl border border-paw-border bg-white p-4">
            <label className="mb-1.5 block text-xs font-semibold text-paw-sub">태그</label>
            <Contents />
          </div>

          {/* 에러 메시지 */}
          {(errors.tags || errors.imgUrls || errors.photoDate) && (
            <div className="rounded-xl bg-red-50 px-3 py-2">
              {errors.tags && <p className="text-xs text-red-500">{errors.tags.message}</p>}
              {errors.imgUrls && <p className="text-xs text-red-500">{errors.imgUrls.message}</p>}
              {errors.photoDate && <p className="text-xs text-red-500">{errors.photoDate.message}</p>}
            </div>
          )}

          {/* 작성 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-paw-orange py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              '작성하기'
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
