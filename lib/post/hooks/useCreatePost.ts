import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { addPost } from '@/lib/post';
import { PostFormData } from '@/lib/post';
import { ApiError } from '@/shared/api-error';
import { POST_KEY } from '@/lib/post';
import { useToast } from '@/components/ui/use-toast';

export const useCreatePost = (options: UseMutationOptions<void, ApiError, PostFormData> = {}) => {
  // QueryClient 인스턴스 가져오기
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, ApiError, PostFormData>({
    mutationFn: addPost,
    onSuccess: (data, variable, ctx) => {
      toast({
        title: '게시글 작성이 완료되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: [POST_KEY] });
      //   console.log('Invalidating queries...');
      //   console.log('Post Query Data:', queryClient.getQueryData([POST_KEY]));
      options.onSuccess?.(data, variable, ctx);
    },
    onError: (error) => {
      toast({
        title: `작성중 오류가 발생했습니다. ${error.message} `,
      });
      console.error('Failed to Create Post', error);
    },
  });
};
